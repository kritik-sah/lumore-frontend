import React from "react";
import { SetNewPasswordForm } from "../components/SetNewPasswordForm";

const SetNewPassword = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetNewPasswordForm />
      </div>
    </div>
  );
};

export default SetNewPassword;
