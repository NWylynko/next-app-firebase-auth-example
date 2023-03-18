import { cookies, headers } from "next/headers";
import { Cache, createRequestContext, Funcs } from "../lib/requestContext";
import { getUserAuthDetails } from "./getUserAuthDetails";

export const createSSRContext = () => {
  const { get: getCookie } = cookies();
  const { get: getHeader } = headers();
  const funcs: Funcs = {
    getCookie: (name: string) => {
      const cookie = getCookie(name);
      if (cookie) {
        return cookie.value;
      }
      return undefined;
    },
    getHeader: (name: string) => {
      const header = getHeader(name);
      if (header) {
        return header;
      }
      return undefined;
    },
  };

  // caching these values for the duration of the request
  const cache: Cache = {
    userAuthDetails: undefined,
  };

  const ctx = createRequestContext(funcs, cache);

  return {
    ...ctx,
    getUserAuthDetails: async () => {
      // If we already have userAuthDetails, return it
      if (cache.userAuthDetails) {
        return cache.userAuthDetails;
      }
      // Otherwise, get userAuthDetails and return it
      cache.userAuthDetails = await getUserAuthDetails(funcs, ctx)();
      return cache.userAuthDetails;
    },
  };
};
