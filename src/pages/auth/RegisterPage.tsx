import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20">
      <div className="w-full max-w-md px-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
