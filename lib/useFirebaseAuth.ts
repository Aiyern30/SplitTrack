import { useState, useEffect } from "react";
import { Auth } from "firebase/auth";
import { initializeFirebase } from "./firebase";

export const useFirebaseAuth = (): Auth | null => {
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);

  useEffect(() => {
    try {
      const auth = initializeFirebase();
      setFirebaseAuth(auth);
    } catch (error) {
      console.error("Error initializing Firebase Auth:", error);
      setFirebaseAuth(null);
    }
  }, []);

  return firebaseAuth;
};
