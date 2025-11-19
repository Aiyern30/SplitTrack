"use client";

import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-red-600 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;
