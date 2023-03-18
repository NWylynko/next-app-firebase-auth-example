import { createSSRContext } from "@/ssr"
import { cache } from "react"

const getAuthDetails = cache(async () => {
  const ctx = createSSRContext();
  const auth = await ctx.getUserAuthDetails();
  return auth
})

export default async function SSRPage() {

  const auth = await getAuthDetails();

  return (
    <main>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </main>
  )
}