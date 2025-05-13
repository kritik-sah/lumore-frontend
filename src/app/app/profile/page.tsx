import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ProfileWrapper from "../components/ProfileWrapper";
import GeneralLayout from "../components/layout/general";
import SubPageLayout from "../components/layout/SubPageLayout";

const Profile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/login");
  }
  console.log("user rocx", user);
  return (
    <GeneralLayout userSetting={true}>
      <ProfileWrapper userId={user._id} />
    </GeneralLayout>
  );
};

export default Profile;
