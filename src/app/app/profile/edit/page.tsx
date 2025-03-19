import { cookies } from "next/headers";
import React from "react";
import EditMyProfile from "../../components/EditMyProfile";

const EditProfile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")!.value)
    : null;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/${user._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    }
  );
  const userProfile = await data.json();

  return <EditMyProfile user={userProfile} />;
};

export default EditProfile;
