import { firebase } from "../app";
import { getAuth } from "firebase-admin/auth";

export const auth = getAuth(firebase());
