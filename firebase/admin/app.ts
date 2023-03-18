import { credential, type ServiceAccount } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";

import serviceAccount from "@/firebase-service-account.json";

export const firebase = () => {
  if (getApps().length === 0) {
    return initializeApp({
      credential: credential.cert(serviceAccount as ServiceAccount),
    });
  }

  return getApps()[0];
};
