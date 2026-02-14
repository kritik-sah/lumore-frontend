"use client";

import Icon from "@/components/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { TextField } from "../InputField";
import { validateSettingsField } from "./validators";

export interface UserSettings {
  email: string;
  phoneNumber: string;
  web3Wallet: {
    addresses: string[];
  };
  password?: string;
}

interface SettingsFieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: keyof UserSettings | "";
  onUpdate: (field: keyof UserSettings, value: any) => Promise<void>;
  currentValue: string | null;
}

const SettingsFieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
}: SettingsFieldEditorProps) => {
  const [value, setValue] = useState(currentValue || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(currentValue || "");
    setError("");
  }, [currentValue]);

  const handleSubmit = async () => {
    try {
      const validationError = validateSettingsField(fieldType as string, value);
      if (validationError) {
        setError(validationError);
        return;
      }

      await onUpdate(fieldType as keyof UserSettings, value);
      setIsOpen(false);
    } catch (submissionError) {
      console.error("Error updating field:", submissionError);
      setError("Failed to update field");
    }
  };

  const handleCancel = () => {
    setValue(currentValue || "");
    setError("");
    setIsOpen(false);
  };

  const label =
    fieldType === "phoneNumber"
      ? "Phone Number"
      : fieldType === "web3Wallet"
        ? "Wallet Address"
        : fieldType
          ? fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
          : "Field";

  const placeholder =
    fieldType === "phoneNumber"
      ? "Enter your phone number"
      : fieldType === "web3Wallet"
        ? "Enter your wallet address"
        : `Enter your ${fieldType}`;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="hidden">
          <SheetTitle>Edit {fieldType}</SheetTitle>
        </SheetHeader>
        <header className="flex items-center justify-between p-3 gap-4 shadow-sm">
          <div className="flex items-center justify-start gap-2">
            <div onClick={handleCancel}>
              <Icon
                name="MdOutlineClose"
                className="text-xl h-6 w-6 text-ui-shade"
              />
            </div>
            <div className="capitalize text-lg font-semibold">Edit {fieldType}</div>
          </div>
          <div onClick={handleSubmit}>
            <Icon name="HiOutlineCheck" className="text-xl h-6 w-6 text-ui-highlight" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            <TextField
              name={fieldType}
              label={label}
              type={fieldType === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              error={error}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsFieldEditor;
