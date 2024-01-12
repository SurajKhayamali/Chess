import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import config from '../config';
import { IncomingHttpHeaders } from 'http';

const COOKIE_KEY = 'jwt';
const COOKIE_REFRESH_KEY = 'jwt-refresh';

const defaultCookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  signed: true,
  maxAge: config.cookieMaxAge,
};

/**
 * Get token from request cookies
 *
 * @param req
 * @param isRefreshCookie
 * @returns token
 */
export const getCookie = (
  req: Request,
  isRefreshCookie = false
): string | null => {
  let token = null;
  if (!req) return token;

  const cookies = defaultCookieOptions.signed ? req.signedCookies : req.cookies;

  if (cookies)
    token = cookies[isRefreshCookie ? COOKIE_REFRESH_KEY : COOKIE_KEY];

  return token;
};

/**
 * Set cookie
 *
 * @param res
 * @param token
 * @param isRefreshCookie
 */
export const setCookie = (
  res: Response,
  token: string,
  isRefreshCookie = false
) => {
  if (!isRefreshCookie)
    return res.cookie(COOKIE_KEY, token, defaultCookieOptions);

  res.cookie(COOKIE_REFRESH_KEY, token, {
    ...defaultCookieOptions,
    maxAge: config.cookieRefreshMaxAge,
  });
};

/**
 * Clear cookie
 *
 * @param res
 */
export const clearCookie = (res: Response) => {
  // res.clearCookie(isRefreshCookie ? COOKIE_REFRESH_KEY : COOKIE_KEY);
  res.clearCookie(COOKIE_REFRESH_KEY);
  res.clearCookie(COOKIE_KEY);
};

export const parseCookieFromHeaders = (
  headers: IncomingHttpHeaders,
  isRefreshCookie = false
) => {
  const cookieFromHeader = headers.cookie;
  if (!cookieFromHeader) return null;

  const cookies = cookie.parse(cookieFromHeader as string);
  if (!cookies) return null;

  const cookieToParse = isRefreshCookie
    ? cookies[COOKIE_REFRESH_KEY]
    : cookies[COOKIE_KEY];

  const parsedCookies = cookieParser.signedCookie(
    cookieToParse,
    config.cookieSecret
  );
  if (!parsedCookies) return null;

  return parsedCookies;
};
