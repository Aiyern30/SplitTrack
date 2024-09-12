"use client";

import { signInWithApple, signInWithGoogle } from "@/lib/firebaseConfig"; // Import your Google sign-in function
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "../ui";

export default function Login() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push("/Dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const user = await signInWithApple();
      if (user) {
        router.push("/Dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center  bg-gray-100">
      <Card className="w-[400px] p-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6">Sign in to access your account.</p>
        <div className="flex justify-center items-center space-x-3">
          <Image
            src="/google.png"
            alt="Google logo"
            width={45}
            height={45}
            className="cursor-pointer hover:bg-[#F1EDED] hover:rounded-full p-1"
            onClick={handleGoogleSignIn}
          />
          <Image
            src="/apple-logo.png"
            alt="Apple logo"
            width={45}
            height={45}
            className="cursor-pointer hover:bg-[#F1EDED] hover:rounded-full p-1"
            onClick={handleAppleSignIn}
          />
        </div>
      </Card>
    </div>
  );
}
