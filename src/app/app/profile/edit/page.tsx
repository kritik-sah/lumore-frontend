import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import GeneralLayout from "../../components/layout/general";
import SubPageLayout from "../../components/layout/SubPageLayout";
import ProfileEditWrapper from "../../components/ProfileEditWrapper";

const EditProfile = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!user || (!accessToken && !refreshToken)) {
    redirect("/app/login");
  }

  return (
    <SubPageLayout title="Edit Profile">
      <ProfileEditWrapper userId={user._id} />
    </SubPageLayout>
  );
};

export default EditProfile;

