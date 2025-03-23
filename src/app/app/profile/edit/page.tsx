import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ProfileEditWrapper from "../../components/ProfileEditWrapper";

const EditProfile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/login");
  }

  return <ProfileEditWrapper userId={user._id} />;
};

export default EditProfile;
