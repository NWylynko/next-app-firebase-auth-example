"use client";

import { onAuthStateChange } from "@/firebase/auth/onAuthStateChange";
import { useAuthJWT, useSetAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { PropsWithChildren } from "react";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { setUser, setError } = useSetAuth();

  useEffect(() => {
    let cancelled = false;
    const unSub = onAuthStateChange({
      onUser: (user) => {
        if (!cancelled) {
          setUser(user);
        }
      },
      onError: (error) => {
        if (!cancelled) {
          setError(error);
        }
      },
    });
    return () => {
      unSub();
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
};
