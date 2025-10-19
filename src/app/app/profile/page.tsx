import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import GeneralLayout from "../components/layout/general";
import SubPageLayout from "../components/layout/SubPageLayout";
import ProfileWrapper from "../components/ProfileWrapper";

const Profile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/app/login");
  }

  return (
    <GeneralLayout userSetting={true}>
      <ProfileWrapper userId={user._id} />
    </GeneralLayout>
  );
};

export default Profile;
