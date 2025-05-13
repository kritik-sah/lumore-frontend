"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { deleteAccount, handleLogout, updateUserData } from "@/lib/apis";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TextField } from "../components/InputField";
import GeneralLayout from "../components/layout/general";
import { useUser } from "../hooks/useUser";
import SubPageLayout from "../components/layout/SubPageLayout";

interface UserSettings {
  email: string;
  phoneNumber: string;
  web3Wallet: {
    addresses: string[];
  };
  password?: string; // Optional for password updates
}

const UserSettings = () => {
  const router = useRouter();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<keyof UserSettings | "">(
    ""
  );
  const [settings, setSettings] = useState<UserSettings>({
    email: "",
    phoneNumber: "",
    web3Wallet: {
      addresses: [],
    },
  });

  // Get user data from cookies
  let userId = "";
  try {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      userId = parsedUser?._id || "";
    }
  } catch (error) {
    console.error("[UserSettings] Error parsing user cookie:", error);
  }

  const { user, isLoading } = useUser(userId);

  useEffect(() => {
    if (user) {
      setSettings({
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        web3Wallet: {
          addresses: user.web3Wallet?.addresses || [],
        },
      });
    }
  }, [user]);

  const handleEditField = (field: keyof UserSettings) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (field: keyof UserSettings, value: any) => {
    try {
      let updateData: any = {};

      // Special handling for web3Wallet addresses
      if (field === "web3Wallet") {
        updateData = {
          web3Wallet: {
            addresses: Array.isArray(value) ? value : [value],
          },
        };
      } else {
        updateData = { [field]: value };
      }

      await updateUserData(updateData);

      setSettings((prev) => ({
        ...prev,
        ...updateData,
      }));

      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
        Cookies.remove("user");
        Cookies.remove("token");
        router.push("/app/login");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SubPageLayout title="User Settings">
      <div className="bg-ui-background/10 p-4">
        <div className="w-full max-w-3xl mx-auto pb-10">
          <h3 className="text-xl font-medium">User Settings</h3>
          <FieldEditor
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

          <div
            onClick={() => handleEditField("email")}
            className="border border-ui-shade/10 rounded-xl p-2 mt-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-ui-shade/60">Email</h3>
                {settings.email || "Not set"}
              </div>
            </div>
          </div>

          <div
            onClick={() => handleEditField("phoneNumber")}
            className="border border-ui-shade/10 rounded-xl p-2 mt-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-ui-shade/60">Phone Number</h3>
                {settings.phoneNumber || "Not set"}
              </div>
            </div>
          </div>

          <div
            onClick={() => handleEditField("web3Wallet")}
            className="border border-ui-shade/10 rounded-xl p-2 mt-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-ui-shade/60">Wallet Address</h3>
                {settings.web3Wallet.addresses[0] || "Not set"}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              variant="outline"
              className="w-full hover:bg-ui-shade hover:text-ui-light"
              onClick={() =>
                handleLogout(() => {
                  router.push("/app/login");
                })
              }
            >
              Logout
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
};

interface FieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: keyof UserSettings | "";
  onUpdate: (field: keyof UserSettings, value: any) => Promise<void>;
  currentValue: string | null;
}

const FieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
}: FieldEditorProps) => {
  const [value, setValue] = useState(currentValue || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(currentValue || "");
    setError("");
  }, [currentValue]);

  const validateField = (field: string, val: string): boolean => {
    setError("");

    switch (field) {
      case "email":
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(val)) {
          setError("Invalid email format");
          return false;
        }
        break;

      case "phoneNumber":
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(val.replace(/\s+/g, ""))) {
          setError("Invalid phone number format");
          return false;
        }
        break;

      case "web3Wallet":
        // Add your wallet address validation logic here
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!walletRegex.test(val)) {
          setError("Invalid wallet address format");
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateField(fieldType as string, value)) {
        return;
      }

      await onUpdate(fieldType as keyof UserSettings, value);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
      setError("Failed to update field");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">
            Edit {fieldType === "phoneNumber" ? "Phone Number" : fieldType}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <TextField
              name={fieldType}
              label={
                fieldType === "phoneNumber"
                  ? "Phone Number"
                  : fieldType === "web3Wallet"
                    ? "Wallet Address"
                    : fieldType?.charAt(0).toUpperCase() + fieldType?.slice(1)
              }
              type={fieldType === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter your ${fieldType === "phoneNumber"
                  ? "phone number"
                  : fieldType === "web3Wallet"
                    ? "wallet address"
                    : fieldType
                }`}
              error={error}
            />
          </div>
        </div>
        <SheetFooter className="flex-shrink-0 mt-4">
          <div className="w-full flex flex-col gap-2">
            <Button type="submit" onClick={handleSubmit} disabled={!!error}>
              Save
            </Button>
            <Button
              variant="outline"
              className="hover:bg-ui-shade hover:text-ui-light"
              onClick={() => {
                setValue(currentValue || "");
                setError("");
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSettings;
