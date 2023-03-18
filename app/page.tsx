"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function HomePage() {

  const auth = useAuth();

  return (
    <main>
      <h1>Hello World</h1>
      <span>This is client side auth, so user will be loading / undefined on first render</span>
      <pre>{JSON.stringify({auth}, null, 2)}</pre>
      <Link href="ssr">Go here for ssr</Link>
    </main>
  )
}