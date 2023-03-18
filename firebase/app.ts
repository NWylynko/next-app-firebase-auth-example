import { initializeApp, getApps } from "firebase/app";
import { env } from "./env";

export const firebase = () => {
  if (getApps().length === 0) {
    return initializeApp({
      apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
      appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }

  return getApps()[0];
};
