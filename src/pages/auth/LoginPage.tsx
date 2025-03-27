import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
