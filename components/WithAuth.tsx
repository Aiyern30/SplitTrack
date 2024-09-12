// /components/WithAuth.tsx
"use client";

import { useRouter } from "next/router";
import { useEffect, ComponentType } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";

// Higher Order Component (HOC) for auth protection
const withAuth = <P extends object>(Component: ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          // If no user is authenticated, redirect to login page
          router.push("/");
        }
      });

      return () => unsubscribe();
    }, [router, auth]);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
