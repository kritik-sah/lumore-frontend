// contexts/PushNotificationContext.tsx
"use client";
import { subscribePushService, unsubscribePushService } from "@/lib/apis";
import { Buffer } from "buffer";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PushNotificationContextType {
  isSupported: boolean;
  subscription: PushSubscription | null;
  isSubscribed: boolean;
  isLoading: boolean;
  permissionState: NotificationPermission;
  subscribeToPush: (userId: string) => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
}

const PushNotificationContext = createContext<
  PushNotificationContextType | undefined
>(undefined);

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export const PushNotificationProvider = ({
  children,
}: PushNotificationProviderProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermissionState(Notification.permission);
      // registerServiceWorker();
    }
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.Buffer = Buffer;
    }
  }, []);

  async function registerServiceWorker() {
    try {
      window.addEventListener("load", async () => {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      });
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }

  async function subscribeToPush(userId: string) {
    if (!isSupported) {
      console.error("Push notifications are not supported");
      return;
    }

    if (!userId) {
      console.error("User must be logged in to subscribe to notifications");
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    try {
      // This will trigger the browser's permission prompt
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      setSubscription(sub);
      setPermissionState(Notification.permission);
      console.log("sub", sub);
      // Save to database with userId
      const result = await subscribePushService(sub);
      console.log("Subscribed:", result);
    } catch (error) {
      console.error("Subscription failed:", error);
      setPermissionState(Notification.permission);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const currentSubscription =
        await registration.pushManager.getSubscription();

      if (!currentSubscription) {
        console.log("No subscription found");
        return;
      }

      // Unsubscribe from browser
      await currentSubscription.unsubscribe();

      // Remove from database
      await unsubscribePushService(currentSubscription.endpoint);

      setSubscription(null);
      console.log("Successfully unsubscribed");
    } catch (error) {
      console.error("Unsubscribe failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function requestPermission() {
    if (!("Notification" in window)) {
      throw new Error("Notifications not supported");
    }
    const permission = await Notification.requestPermission();
    setPermissionState(permission);
    return permission;
  }

  const value: PushNotificationContextType = {
    isSupported,
    subscription,
    isSubscribed: subscription !== null,
    isLoading,
    permissionState,
    subscribeToPush,
    unsubscribeFromPush,
    requestPermission,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotification = () => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error(
      "usePushNotification must be used within a PushNotificationProvider",
    );
  }
  return context;
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
