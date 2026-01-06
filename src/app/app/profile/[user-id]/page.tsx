import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import React from "react";
import GeneralLayout from "../../components/layout/general";
import SubPageLayout from "../../components/layout/SubPageLayout";
import ProfileWrapper from "../../components/ProfileWrapper";

const UserProfile = async ({
  params,
}: {
  params: Promise<{ "user-id": string }>;
}) => {
  const { "user-id": userId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  if (!token || !user) {
    redirect("/app/login");
  }

  return (
    <SubPageLayout title="Go Back">
      <ProfileWrapper userId={userId || ""} />
    </SubPageLayout>
  );
};

export default UserProfile;
