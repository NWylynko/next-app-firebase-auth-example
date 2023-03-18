import { type User, ErrorFn, onAuthStateChanged } from "firebase/auth";
import { auth } from "./client";

type Callbacks = {
  onUser?: (user: User | undefined) => void;
  onError?: ErrorFn;
  onDoneLoading?: () => void;
}

export const onAuthStateChange = (callbacks: Callbacks) => {
  return onAuthStateChanged(auth, (user) => {
    if (callbacks.onUser) {
      callbacks.onUser(user ? user : undefined);
    }
    if (callbacks.onDoneLoading) {
      callbacks.onDoneLoading();
    }
  }, callbacks.onError);
}