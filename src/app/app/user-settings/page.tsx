"use client";

import { SettingsPageLoader } from "@/components/page-loaders";
import { Button } from "@/components/ui/button";
import {
  deleteAccount,
  fetchRecoveryStatus,
  fetchRecoveryBackup,
  recoverWithPin,
  setupRecoveryPin,
  updateUserData,
} from "@/lib/apis";
import {
  buildPinRecoveryBackup,
  ensureIdentityKeyPair,
  recoverIdentityFromPinBackup,
} from "@/lib/chat-crypto/identity";
import useAuth from "@/service/requests/auth";
import { getUser } from "@/service/storage";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingFieldCard from "../components/settings/SettingFieldCard";
import SettingsFieldEditor, {
  UserSettings,
} from "../components/settings/SettingsFieldEditor";
import SubPageLayout from "../components/layout/SubPageLayout";
import { useUser } from "../hooks/useUser";
import { RecoveryPinSheet } from "../components/recovery/RecoveryPinSheet";

const UserSettingsPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<keyof UserSettings | "">("");
  const [settings, setSettings] = useState<UserSettings>({
    email: "",
    phoneNumber: "",
    web3Wallet: { addresses: [] },
  });
  const [recoveryStatus, setRecoveryStatus] = useState<string>("");
  const [recoveryEnabled, setRecoveryEnabled] = useState(false);
  const [needsPinUpgrade, setNeedsPinUpgrade] = useState(false);
  const [isSetPinOpen, setIsSetPinOpen] = useState(false);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  let userId = "";
  try {
    const user = getUser();
    if (user) userId = user?._id || "";
  } catch (error) {
    console.error("[UserSettings] Error parsing user cookie:", error);
  }

  const { user, isLoading } = useUser(userId);

  useEffect(() => {
    if (!user) return;
    setSettings({
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      web3Wallet: {
        addresses: user.web3Wallet?.addresses || [],
      },
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await fetchRecoveryStatus();
        if (cancelled) return;
        setRecoveryEnabled(Boolean(status?.recoveryEnabled));
        setNeedsPinUpgrade(Boolean(status?.needsPinUpgrade));
      } catch (error) {
        console.error("[Recovery] Failed to fetch status:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEditField = (field: keyof UserSettings) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (field: keyof UserSettings, value: any) => {
    try {
      const updateData =
        field === "web3Wallet"
          ? { web3Wallet: { addresses: Array.isArray(value) ? value : [value] } }
          : { [field]: value };

      await updateUserData(updateData);
      setSettings((prev) => ({ ...prev, ...updateData }));
      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      Cookies.remove("user");
      Cookies.remove("token");
      router.push("/app/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleCreateRecoveryBackup = async (pin: string) => {
    try {
      setRecoveryLoading(true);
      await ensureIdentityKeyPair();
      const backup = await buildPinRecoveryBackup(pin);
      await setupRecoveryPin({ ...backup, pin });
      setRecoveryEnabled(true);
      setNeedsPinUpgrade(false);
      setRecoveryStatus("Secure recovery is enabled.");
      setIsSetPinOpen(false);
    } catch (error) {
      console.error("[Recovery] backup failed:", error);
      setRecoveryStatus("Could not secure chats right now.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleRecoverFromBackup = async (pin: string) => {
    try {
      setRecoveryLoading(true);
      const backup = await recoverWithPin(pin);
      await recoverIdentityFromPinBackup(backup, pin);
      setRecoveryStatus("Chats are ready on this device.");
      setIsRecoverOpen(false);
    } catch (error) {
      console.error("[Recovery] restore failed:", error);
      const backup = await fetchRecoveryBackup().catch(() => null);
      if (backup) {
        try {
          await recoverIdentityFromPinBackup(backup, pin);
          setRecoveryStatus("Chats are ready on this device.");
          setIsRecoverOpen(false);
          return;
        } catch {}
      }
      setRecoveryStatus("That PIN didn’t match. Try again.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  if (isLoading) {
    return <SettingsPageLoader />;
  }

  return (
    <SubPageLayout title="User Settings">
      <div className="bg-ui-background/10 p-4">
        <div className="w-full max-w-3xl mx-auto pb-10">
          <h3 className="text-xl font-medium">User Settings</h3>
          <SettingsFieldEditor
            isOpen={isEditFieldOpen}
            setIsOpen={setIsEditFieldOpen}
            fieldType={editFieldType}
            onUpdate={handleFieldUpdate}
            currentValue={
              editFieldType === "web3Wallet"
                ? settings.web3Wallet.addresses[0]
                : editFieldType
                  ? settings[editFieldType] ?? null
                  : null
            }
          />

          <SettingFieldCard
            label="Email"
            value={settings.email}
            onClick={() => handleEditField("email")}
          />
          <SettingFieldCard
            label="Phone Number"
            value={settings.phoneNumber}
            onClick={() => handleEditField("phoneNumber")}
          />
          <SettingFieldCard
            label="Wallet Address"
            value={settings.web3Wallet.addresses[0]}
            onClick={() => handleEditField("web3Wallet")}
          />

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsSetPinOpen(true)}
              >
                {needsPinUpgrade ? "Upgrade chat recovery" : "Secure chats"}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsRecoverOpen(true)}
              >
                Recover chats
              </Button>
              <p className="text-xs text-ui-shade/80">
                {recoveryEnabled ? "Recovery enabled" : "Recovery not set up"}
              </p>
              {recoveryStatus ? (
                <p className="text-sm text-ui-shade">{recoveryStatus}</p>
              ) : null}
            </div>
            <Button
              variant="outline"
              className="w-full hover:bg-ui-shade hover:text-ui-light"
              onClick={logout}
            >
              Logout
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      <RecoveryPinSheet
        open={isSetPinOpen}
        onOpenChange={setIsSetPinOpen}
        title="Secure your chats"
        description="Set a 6-digit chat PIN to restore secure messages on new devices."
        submitLabel="Save PIN"
        loading={recoveryLoading}
        statusText={recoveryStatus}
        onSubmit={handleCreateRecoveryBackup}
      />
      <RecoveryPinSheet
        open={isRecoverOpen}
        onOpenChange={setIsRecoverOpen}
        title="Recover chats"
        description="Enter your 6-digit chat PIN to restore secure messages."
        submitLabel="Recover chats"
        loading={recoveryLoading}
        statusText={recoveryStatus}
        onSubmit={handleRecoverFromBackup}
      />
    </SubPageLayout>
  );
};

export default UserSettingsPage;
