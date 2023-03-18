import { auth } from "./client"

export const logout = () => {
  return auth.signOut();
}