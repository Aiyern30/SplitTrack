// components/LogoutButton.tsx
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { getAuth, signOut } from "firebase/auth";

const LogoutButton: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.removeItem("user"); // Clear user info from local storage

      // Redirect to the home page after successful logout
      router.push("/"); // Use router.push to navigate
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return <button onClick={handleSignOut}>Logout</button>;
};

export default LogoutButton;
