import { auth } from "./client";
import { signInAnonymously } from "firebase/auth";

export const authWithAnon = () => {
  return signInAnonymously(auth);
};
