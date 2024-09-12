import { useEffect, useState } from "react";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { initializeFirebase } from "./firebase"; // Import the initialization function
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [authState, setAuthState] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = initializeFirebase(); // Initialize Firebase and get the auth instance

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) {
        router.push("/"); // Redirect to home if not authenticated
      }
      setAuthState(auth); // Set authState only if the auth instance is available
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  return { auth: authState, loading };
};

export default useAuth;
