"use client";
import React from "react";
import { useUser } from "../hooks/useUser";
import { useUserPosts } from "../hooks/useUserPosts";
import MyProfile from "./MyProfile";

interface ProfileWrapperProps {
  userId: string;
}

const ProfileWrapper = ({ userId }: ProfileWrapperProps) => {
  const { user, isLoading } = useUser(userId);
  const { posts, isLoading: isPostsLoading } = useUserPosts(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return <MyProfile user={user} posts={posts} />;
};

export default ProfileWrapper;
