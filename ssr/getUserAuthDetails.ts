import { verifySessionCookie } from "@/firebase/admin/auth/verifySessionCookie";
import { Funcs, RequestContext, AuthDetails } from "@/lib/requestContext";
import { redirect } from "next/navigation";

export const getUserAuthDetails = (funcs: Funcs, ctx: RequestContext) => async (): Promise<AuthDetails> => {
  const requestedUrl = funcs.getHeader("referer") ?? funcs.getHeader("origin") ?? "/";
  const token = await ctx.getJwt();

  if (!token) {
    redirect(`/refresh-session?redirect=${requestedUrl}`);
  }

  try {
    const user = await verifySessionCookie(token);

    return {
      authId: user.user_id,
      name: user.name,
      picture: user.picture,
    };
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    if (error.code === "auth/session-cookie-expired") {
      redirect(`/refresh-session?redirect=${requestedUrl}`);
    } else {
      throw error;
    }
  }
};
