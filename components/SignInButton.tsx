import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useFirebaseAuth } from "@/lib/useFirebaseAuth"; // Use the hook
import { createUserProfile } from "@/lib/firestoreService"; // Import the createUserProfile function

const SignInButton: React.FC = () => {
  const auth = useFirebaseAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!auth) {
      console.error("Firebase auth is not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user profile in Firestore
      await createUserProfile({
        uid: user.uid,
        displayName: user.displayName || "", // Provide a fallback empty string
        email: user.email || "",
        photoURL: user.photoURL || "",
      });

      localStorage.setItem("user", JSON.stringify(user));
      console.log("Signed in user:", user);

      router.push("/Dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <button onClick={handleSignIn}>
      <Image
        src="/google.png"
        alt="Google logo"
        width={45}
        height={45}
        className="cursor-pointer hover:bg-[#F1EDED] hover:rounded-full p-1"
      />
    </button>
  );
};

export default SignInButton;
