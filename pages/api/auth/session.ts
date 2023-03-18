import { z } from "zod";
import { verifySessionCookie } from "@/firebase/admin/auth/verifySessionCookie";
import { createSessionCookie } from "@/firebase/admin/auth/createSessionCookie";
import { serialize } from "cookie";
import { JsonHandler, ApiError } from "next-json-api";

const schema = z.object({
  jwt: z.string(),
  forceRefresh: z.boolean().optional(),
});

const fifteenMinutes = 60 * 15 * 1000;

const sessionCookie = (session: string, expiry: number) => {
  return serialize("session", session, {
    path: "/",
    httpOnly: false,
    maxAge: expiry,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

const checkAuthSession = async ({
  existingSession,
  jwt,
  defaultExpiry,
}: {
  existingSession?: string;
  jwt: string;
  defaultExpiry: number;
}) => {
  // if they have an existing session, check if its valid
  if (existingSession) {
    try {
      const user = await verifySessionCookie(existingSession);
      const expiry = user.exp * 1000 - Date.now();

      if (expiry > 10 * 1000) {
        // 10 second tolerance
        return { msg: "session still valid", expiry } as const;
      } else {
        const session = await createSessionCookie(jwt);
        return { msg: "session refreshed (expired)", session, expiry: defaultExpiry } as const;
      }
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      if (error.code === "auth/session-cookie-expired") {
        const session = await createSessionCookie(jwt);
        return { msg: "session refreshed (thrown expired)", session, expiry: defaultExpiry } as const;
      } else {
        console.error(error);
        throw new ApiError("Unauthorized (401)", "invalid session");
      }
    }
  }

  // if it doesn't exist or is invalid, create a new session
  const session = await createSessionCookie(jwt);
  return {
    msg: "new session",
    session,
    expiry: defaultExpiry,
  } as const;
};

const session = JsonHandler(async (req, res) => {
  // make sure this a a post request
  if (req.method !== "POST") {
    throw new ApiError("Method Not Allowed (405)", "Please POST to this endpoint");
  }

  // parse the request body
  const { jwt } = await schema.parseAsync(req.body);

  const { msg, session, expiry } = await checkAuthSession({
    // check in they already have a session in their cookie
    existingSession: req.cookies.session,
    jwt,
    defaultExpiry: fifteenMinutes,
  });

  if (session) {
    res.setHeader("Set-Cookie", sessionCookie(session, fifteenMinutes));
  }

  return { msg, expiry } as const;
});

export default session;

export type SessionRequest = z.infer<typeof schema>;
export type SessionResponse = Awaited<ReturnType<typeof session>>;
