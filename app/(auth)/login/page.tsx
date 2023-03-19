"use client"

import { useEffect } from "react";
import { useSession } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import GoogleLogin from "./Google";
import AnonLogin from "./Anon";

export default function LoginPage() {
  const router = useRouter();
  const { gotSession } = useSession();

  useEffect(() => {
    if (gotSession) {
      router.push("/");
    }
  }, [gotSession]);

  return (
    <main>
      <h1>Login</h1>
      <GoogleLogin />
      <AnonLogin />
    </main>
  )
}