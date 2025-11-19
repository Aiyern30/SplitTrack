import { useState, useEffect } from "react";
import { Auth } from "firebase/auth";
import { auth } from "./firebase";

export const useFirebaseAuth = (): Auth | null => {
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);

  useEffect(() => {
    // Set the auth instance from the centralized firebase file
    setAuthInstance(auth);
  }, []);

  return authInstance;
};
