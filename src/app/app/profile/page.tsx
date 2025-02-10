"use client";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Link from "next/link";
import React from "react";
import { useLogout } from "../hooks/useAuth";

const Profile = () => {
  const token = Cookies.get("token");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  const { logout } = useLogout();

  if (!user || !token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-xs px-6 text-center">
          <h3 className="text-3xl">Lumore</h3>
          <p className="text-sm">
            Seems like you are not logged in, Try logging in or create a new
            account
          </p>
          <div className="">
            <Link
              href="/app/login"
              className="text-ui-accent hover:text-ui-accent/60"
            >
              login
            </Link>{" "}
            or{" "}
            <Link
              href="/app/signup"
              className="text-ui-accent hover:text-ui-accent/60"
            >
              signup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>Welcome, {user?.username}</h3>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Profile;
