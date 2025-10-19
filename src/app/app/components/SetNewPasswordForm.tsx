"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setNewPassword } from "@/lib/apis";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useOnboarding } from "../hooks/useOnboarding";

export function SetNewPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  useOnboarding();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate, isError } = useSetNewPassword();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      newErrors.newPassword = "Password is required";
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.newPassword = "Both password field should be same";
    }

    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      mutate(
        { newPassword: formData?.newPassword },
        {
          onSuccess: () => {
            router.push("/app"); // Redirect after login
          },
        }
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>
            Please create a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="text-sm"
                  required
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <div className="flex relative items-center justify-between">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[10px] text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {isError && (
                <p className="text-red-500 text-sm">
                  Invalid credentials, please try again.
                </p>
              )}
              <Button type="submit" className="w-full">
                Set Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const useSetNewPassword = () => {
  return useMutation({
    mutationFn: setNewPassword,
    onSuccess: (data) => {
      console.log("Set new password successfully:", data);
    },
    onError: (error) => {
      console.error("Set new password failed:", error);
    },
  });
};
