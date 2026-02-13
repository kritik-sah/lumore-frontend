"use client";
import { ProfilePageLoader } from "@/components/page-loaders";
import React from "react";
import { useUser } from "../hooks/useUser";
import EditMyProfile from "./EditMyProfile";

interface ProfileEditWrapperProps {
  userId: string;
}

const ProfileEditWrapper = ({ userId }: ProfileEditWrapperProps) => {
  const { user, isLoading } = useUser(userId);

  if (isLoading) {
    return <ProfilePageLoader />;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return <EditMyProfile user={user} />;
};

export default ProfileEditWrapper;
