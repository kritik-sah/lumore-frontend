"use client";
import { ProfilePageLoader } from "@/components/page-loaders";
import React from "react";
import { useUser } from "../hooks/useUser";
import { useUserPosts } from "../hooks/useUserPosts";
import { useUserPrefrence } from "../hooks/useUserPrefrence";
import MyProfile from "./MyProfile";

interface ProfileWrapperProps {
  userId: string;
}

const ProfileWrapper = ({ userId }: ProfileWrapperProps) => {
  const { user, isLoading } = useUser(userId);
  const { posts, isLoading: isPostsLoading } = useUserPosts(userId);
  const { userPrefrence } = useUserPrefrence(userId);

  if (isLoading || isPostsLoading) {
    return <ProfilePageLoader />;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return <MyProfile user={user} posts={posts} preferences={userPrefrence} />;
};

export default ProfileWrapper;
