// lib/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth();
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setLoading(false);
      if (!user) {
        router.push("/"); // Redirect to home if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  return { auth, loading };
};

export default useAuth;
