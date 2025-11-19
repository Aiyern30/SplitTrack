"use client";

import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthInstance(auth);
      } else {
        setAuthInstance(null);
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { auth: authInstance, loading };
};

export default useAuth;
