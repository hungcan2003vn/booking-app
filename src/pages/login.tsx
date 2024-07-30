// src/app/Login.tsx
"use client";
import React from 'react';
import UserAuthForm from "../components/user-auth-form"

const Login: React.FC = () => {
  return (
    
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center grid gap-3 ">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground ">
            Enter your email and password below to login to your account
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
};

export default Login