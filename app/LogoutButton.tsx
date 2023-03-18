"use client";

import { logout } from "@/firebase/auth/logout";

export const LogoutButton = () => {
  return <button onClick={logout}>Logout</button>
}