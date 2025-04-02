import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import GeneralLayout from "../../components/layout/general";
import ProfileWrapper from "../../components/ProfileWrapper";

interface UserProfileProps {
  params: {
    "user-id": string;
  };
}

const UserProfile = async ({ params }: UserProfileProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/login");
  }

  return (
    <GeneralLayout>
      <ProfileWrapper userId={params["user-id"]} />
    </GeneralLayout>
  );
};

export default UserProfile;
