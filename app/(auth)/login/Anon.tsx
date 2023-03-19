"use client";

import { authWithAnon } from "@/firebase/auth/authWithAnon";

export default function AnonLogin() {
  return <button onClick={authWithAnon}>Continue Anonymously</button>
}