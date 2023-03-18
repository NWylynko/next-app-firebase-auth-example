import { auth } from "./client"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const authWithGoogle = async () => {
  return signInWithPopup(auth, provider);
}