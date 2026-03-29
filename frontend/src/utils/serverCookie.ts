"use server";

import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {cookies} from "next/headers";

export const setCookie = (key: string, value: string, options: Partial<ResponseCookie>) => {
  const cookieStore = cookies();
  cookieStore.set(key, value, options);
};

export const getCookie = (key: string) => {
  const cookieStore = cookies();
  return cookieStore.get(key)?.value || null;
};

export const deleteCookie = (key: string) => {
  const cookieStore = cookies();
  cookieStore.delete(key);
};
