"use client";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const _id = searchParams.get("_id");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const username = searchParams.get("username");
    const setPassword = searchParams.get("setPassword") === "true";

    if (token) {
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify({ _id, email, username, token }), {
        expires: 7,
      });
      console.log("setPassword", setPassword);
      router.push(setPassword ? "/app/set-new-password" : `/app`);
    } else {
      router.push("/app/login"); // If no token, go back to login
    }
  }, [router, searchParams]);

  return <p>Logging in...</p>;
}
