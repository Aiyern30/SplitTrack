"use client";

import { Card } from "../ui";
import SignInButton from "../SignInButton";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center  bg-gray-100">
      <Card className="w-[400px] p-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6">Sign in to access your account.</p>
        <div className="flex justify-center items-center space-x-3">
          <SignInButton></SignInButton>
          <SignInButton></SignInButton>
        </div>
      </Card>
    </div>
  );
}
