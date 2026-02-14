"use client";

import { SettingsPageLoader } from "@/components/page-loaders";
import { Button } from "@/components/ui/button";
import { deleteAccount, updateUserData } from "@/lib/apis";
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
    </SubPageLayout>
  );
};

export default UserSettingsPage;
