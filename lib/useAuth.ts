"use client";

import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

const useAuth = () => {
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthInstance(auth);
      } else {
        setAuthInstance(null);
        // Only redirect to home if on a protected route
        if (pathname && pathname.startsWith("/Dashboard")) {
          router.push("/");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return { auth: authInstance, loading };
};

export default useAuth;
