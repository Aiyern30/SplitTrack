import { useState, useEffect } from "react";
import { Auth } from "firebase/auth";
import { initializeFirebase } from "./firebase";

export const useFirebaseAuth = (): Auth | null => {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    try {
      const { auth: firebaseAuth } = initializeFirebase();
      setAuth(firebaseAuth);
    } catch (error) {
      console.error("Error initializing Firebase Auth:", error);
      setAuth(null);
    }
  }, []);

  return auth;
};
