import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ProfileEditWrapper from "../../components/ProfileEditWrapper";
import GeneralLayout from "../../components/layout/general";
import SubPageLayout from "../../components/layout/SubPageLayout";

const EditProfile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/login");
  }

  return (
    <SubPageLayout title="Edit Profile">
      <ProfileEditWrapper userId={user._id} />
    </SubPageLayout>
  );
};

export default EditProfile;
