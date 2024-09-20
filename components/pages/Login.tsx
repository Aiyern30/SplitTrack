"use client";

import { Card } from "../ui";
import SignInButton from "../SignInButton";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 my-5 ">
      <Card className="w-[400px] p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h1>
        <p className="mb-6 text-center text-gray-600">
          Sign in to access your account.
        </p>
        <div className="flex justify-center items-center space-x-3">
          <SignInButton />
          <SignInButton />
        </div>
      </Card>
    </div>
  );
}
