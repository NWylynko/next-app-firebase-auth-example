import { auth } from "./client";

export const createSessionCookie = async (jwt: string) => {
  const fifteenMinutes = 60 * 15 * 1000;
  return await auth.createSessionCookie(jwt, { expiresIn: fifteenMinutes });
};
