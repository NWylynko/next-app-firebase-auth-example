import type { Details } from "./admin/auth/setUserDetails";

export module "firebase-admin/lib/auth/token-verifier" {
  export interface DecodedIdToken extends Details {}
}
