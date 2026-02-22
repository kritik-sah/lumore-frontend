"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMemo, useState } from "react";

interface RecoveryPinSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (pin: string) => Promise<void>;
  loading?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  statusText?: string | null;
}

export const RecoveryPinSheet = ({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  onSubmit,
  loading = false,
  secondaryLabel,
  onSecondary,
  statusText,
}: RecoveryPinSheetProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => /^\d{6}$/.test(pin), [pin]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Enter a valid 6-digit PIN.");
      return;
    }
    setError(null);
    await onSubmit(pin);
    setPin("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              const next = e.target.value.replace(/\D+/g, "").slice(0, 6);
              setPin(next);
              setError(null);
            }}
            placeholder="Enter 6-digit PIN"
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {statusText ? <p className="text-xs text-ui-shade">{statusText}</p> : null}
          <div className="flex gap-2">
            {secondaryLabel ? (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onSecondary}
              >
                {secondaryLabel}
              </Button>
            ) : null}
            <Button
              type="button"
              className="flex-1"
              disabled={loading || !canSubmit}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

