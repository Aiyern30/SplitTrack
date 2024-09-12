// /app/Dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is authenticated, redirect to login page
        router.push("/");
      } else {
        // User is authenticated, set loading to false
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    // You can return a loading spinner or null here
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Logged In: Welcome to your Dashboard!</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
