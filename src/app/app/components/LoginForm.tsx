"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import useAuth from "@/service/requests/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { id } = await loginWithGoogle(tokenResponse?.code);
      if (id) {
        router.push("/app"); // Redirect after login
      }
    },
    flow: "auth-code",
  });

  // Function to handle Google login
  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className={cn("flex flex-col  gap-6", className)} {...props}>
      <img
        src="/assets/lumore-hr-white.svg"
        alt="Lumore"
        className="mx-auto h-16"
      />
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full bg-ui-light text-ui-shade mt-2 text-lg p-6"
      >
        <Icon name="FcGoogle" className="!text-2xl !h-6 !w-6" />
        Login with Google
      </Button>
      <div className=" text-ui-light text-center text-xs">
        *By signing up, you agree to our Terms & Conditions to use this app.
      </div>
    </div>
  );
}
