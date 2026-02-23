"use client";

import { fetchRecoveryStatus, recoverWithPin } from "@/lib/apis";
import { recoverIdentityFromPinBackup } from "@/lib/chat-crypto/identity";
import { getIdentityPrivateKeyPkcs8 } from "@/lib/chat-crypto/indexeddb";
import { getUser } from "@/service/storage";
import { useEffect, useState } from "react";
import { RecoveryPinSheet } from "./RecoveryPinSheet";

const formatLockTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "later";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const ChatRecoveryGate = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = getUser();
        if (!user?._id) return;

        const localPrivateKey = await getIdentityPrivateKeyPkcs8();
        if (localPrivateKey) return;

        const recovery = await fetchRecoveryStatus();
        if (
          !cancelled &&
          recovery?.recoveryEnabled &&
          recovery?.recoveryMethod === "pin"
        ) {
          setOpen(true);
        }
      } catch (error) {
        console.error("[RecoveryGate] Failed loading recovery status:", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  return (
    <RecoveryPinSheet
      open={open}
      onOpenChange={setOpen}
      title="Recover chats"
      description="Enter your 6-digit chat PIN to restore secure messages on this device."
      submitLabel="Recover chats"
      loading={loading}
      statusText={status}
      onSubmit={async (pin) => {
        setLoading(true);
        setStatus(null);
        try {
          const payload = await recoverWithPin(pin);
          await recoverIdentityFromPinBackup(payload, pin);
          setStatus("Chats are ready on this device.");
          setOpen(false);
        } catch (error: any) {
          const lockUntil = error?.response?.data?.pinLockedUntil;
          if (lockUntil) {
            setStatus(`Too many tries. Try again after ${formatLockTime(lockUntil)}.`);
            return;
          }
          setStatus("That PIN didn’t match. Try again.");
        } finally {
          setLoading(false);
        }
      }}
    />
  );
};
