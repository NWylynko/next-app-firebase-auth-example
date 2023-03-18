import { getAuth } from "firebase/auth";
import { firebase } from "../app";

export const auth = getAuth(firebase());
