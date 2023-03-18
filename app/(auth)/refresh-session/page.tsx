"use client";

import { useSession } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

const schema = z.object({
  redirect: z.string().nullable(),
});

export default function refreshSessionPage() {
  const { gotSession } = useSession();
  const router = useRouter();
  const unsafeParams = useSearchParams();

  const params = schema.parse({
    redirect: unsafeParams?.get("redirect"),
  });

  useEffect(() => {
    if (gotSession) {
      router.push(params.redirect ?? "/");
    }
  }, [gotSession]);

  return (
    <main>
      <h2>Logging you in</h2>
    </main>
  );
}
