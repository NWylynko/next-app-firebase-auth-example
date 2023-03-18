import { verifySessionCookie } from "@/firebase/admin/auth/verifySessionCookie";

export type Funcs = {
  getCookie: (name: string) => string | undefined;
  getHeader: (name: string) => string | undefined;
};

const getJwt = (funcs: Funcs, cache: Cache) => async () => {
  const jwt = funcs.getCookie("session");

  if (!jwt) {
    throw new Error("No session cookie (jwt)");
  }

  return jwt;
};

export type AuthDetails = {
  authId: string;
  name?: string;
  picture?: string;
};

const getUserAuthDetails = (funcs: Funcs, cache: Cache) => async (): Promise<AuthDetails> => {
  // If we already have userAuthDetails, return it
  if (cache.userAuthDetails) {
    return cache.userAuthDetails;
  }

  const token = await getJwt(funcs, cache)();
  const user = await verifySessionCookie(token);

  const authDetails: AuthDetails = {
    authId: user.user_id,
    name: user.name,
    picture: user.picture,
  };

  cache.userAuthDetails = authDetails;

  return authDetails;
};

const getAuthId = (funcs: Funcs, cache: Cache) => async (): Promise<string> => {
  const userAuthDetails = await getUserAuthDetails(funcs, cache)();

  return userAuthDetails.authId;
};

export type Cache = {
  userAuthDetails?: AuthDetails;
};

export const createRequestContext = (funcs: Funcs, cache: Cache) => {
  return {
    getJwt: getJwt(funcs, cache),
    getUserAuthDetails: getUserAuthDetails(funcs, cache),
    getAuthId: getAuthId(funcs, cache),
  };
};

export type RequestContext = ReturnType<typeof createRequestContext>;
