"use client";

import { authWithGoogle } from "@/firebase/auth/authWithGoogle";

export default function GoogleLogin() {
  return <button onClick={authWithGoogle}>Continue with Google</button>
}