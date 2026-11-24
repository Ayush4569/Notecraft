import { CookieOptions } from "express";

export const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
});

export const accessTokenOptions: CookieOptions = {
  ...getCookieOptions(),
  maxAge: 60 * 60 * 1000,
};

export const refreshTokenOptions: CookieOptions = {
  ...getCookieOptions(),
  maxAge: 60 * 60 * 24 * 7 * 1000,
};

export const clearCookieOptions: CookieOptions = {
  ...getCookieOptions(),
};
