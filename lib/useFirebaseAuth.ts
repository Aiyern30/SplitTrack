// lib/useFirebaseAuth.ts
import { useState, useEffect } from "react";
import { Auth } from "firebase/auth";
import { auth } from "./firebase"; // Import the initialized auth

export const useFirebaseAuth = (): Auth | null => {
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(auth);

  useEffect(() => {
    if (auth) {
      setFirebaseAuth(auth);
    }
  }, []);

  return firebaseAuth;
};
