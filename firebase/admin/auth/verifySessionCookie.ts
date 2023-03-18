import type { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "./client";

export const verifySessionCookie = async (jwt: string) => {
  return auth.verifySessionCookie(jwt);
};

export type UserAuthDetails = DecodedIdToken;
