"use client";

import { create } from "zustand";
import { shallow } from "zustand/shallow";
import axios, { type AxiosResponse } from "axios";
import { type User as FirebaseUser } from "firebase/auth";
import type { SessionResponse, SessionRequest } from "@/pages/api/auth/session";
import { redirect } from "next/navigation";
import { AuthDetails } from "@/lib/requestContext";

const postSession = (jwt: string, forceRefresh?: boolean) =>
  axios.post<SessionResponse, AxiosResponse<SessionResponse>, SessionRequest>("/api/auth/session", {
    jwt,
    forceRefresh,
  });

const fetchSession = async (jwt: string, forceRefresh?: boolean) => {
  const { data } = await postSession(jwt, forceRefresh);
  if ("error" in data) {
    if (data.code === 401) {
      redirect(`/refresh-session?redirect=${window.location.href}`);
    }
    throw new Error(data.error);
  }
  return data;
};

type ClientSideAuthDetails = AuthDetails & {
  getIdToken: FirebaseUser["getIdToken"];
}

type Setters = {
  setUser: (user: FirebaseUser | undefined) => void;
  setError: (error: Error | undefined) => void;
  setKnownEmail: (email: string) => void;
};

type Actions = {
  logout: () => void;
  refreshSession: () => Promise<void>;
};

type Getters = {
  knownEmail?: string;
  gotSession?: boolean;
};

type LoggedIn = {
  user: ClientSideAuthDetails;
  loading: false;
  error: undefined;
  jwt: string;
};

type LoggedOut = {
  user: undefined;
  loading: false;
  error: undefined;
  jwt: undefined;
};

type LoadingState = {
  user: undefined;
  loading: true;
  error: undefined;
  jwt: undefined;
};

type ErrorState = {
  user: undefined;
  loading: false;
  error: Error;
  jwt: undefined;
};

type AuthState = LoggedIn | LoggedOut | LoadingState | ErrorState;

type AuthStore = Getters & Setters & Actions & AuthState;

let sessionTimeout: NodeJS.Timeout;
let sessionInterval: NodeJS.Timeout;

const useAuthStore = create<AuthStore>()((set, get) => ({
  user: undefined,
  setUser: async (firebaseUser) => {

    console.log("firebaseUser", firebaseUser);

    if (firebaseUser) {
      const user: ClientSideAuthDetails =  {
        authId: firebaseUser.uid,
        name: firebaseUser.displayName ?? undefined,
        picture: firebaseUser.photoURL ?? undefined,
        getIdToken: firebaseUser.getIdToken.bind(firebaseUser),
      }
      set({ user });
      const jwt = await firebaseUser.getIdToken();
      set({ jwt });
      const data = await fetchSession(jwt);
      set({ gotSession: true });

      sessionTimeout = setTimeout(async () => {
        // the data.expiry here could be anything
        const data = await fetchSession(jwt);
        sessionInterval = setInterval(async () => {
          // the data.expiry here is a standard interval (eg 15 minutes)
          await fetchSession(jwt);
        }, data.expiry);
      }, data.expiry);
    } else {
      set({ jwt: undefined, user: undefined });
      clearTimeout(sessionTimeout);
      clearInterval(sessionInterval);
    }
    set({ loading: false });
  },
  loading: true,
  error: undefined,
  setError: (error) => {
    set({ error });
    set({ loading: false });
  },
  jwt: undefined,
  setKnownEmail: (email) => set({ knownEmail: email }),
  knownEmail: undefined,
  gotSession: undefined,
  logout: () => {
    set({
      user: undefined,
      loading: false,
      error: undefined,
      jwt: undefined,
      knownEmail: undefined,
      gotSession: undefined,
    });
  },
  refreshSession: async () => {
    const jwt = get().jwt;
    const user = get().user;
    if (!jwt) {
      throw new Error("No JWT");
    }
    if (!user) {
      throw new Error("No user");
    }
    await user?.getIdToken(true);
    const { data } = await postSession(jwt, true);
    if ("error" in data) {
      throw new Error(data.error);
    }
  },
}));

export const useAuth = () => useAuthStore(({ user, loading, error, jwt }) => ({ user, loading, error, jwt }), shallow);
export const useSetAuth = () => useAuthStore(({ setUser, setError }) => ({ setUser, setError }), shallow);
export const useAuthJWT = () => useAuthStore(({ jwt }) => jwt);
export const useSession = () => useAuthStore(({ gotSession }) => ({ gotSession }), shallow);
export const useKnownEmail = () =>
  useAuthStore(({ knownEmail, setKnownEmail }) => ({ knownEmail, setKnownEmail }), shallow);
export const useLogout = () => useAuthStore(({ logout }) => ({ logout }), shallow);
export const useRefreshSession = () => useAuthStore(({ refreshSession }) => ({ refreshSession }), shallow);
