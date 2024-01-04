import { sign, verify } from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

import config from '../config';
import { JwtPayload } from '../interfaces/jwt.interface';
import { getCookie } from './cookie.helper';

/**
 * Sign JWT
 *
 * @param payload
 * @param expiresIn
 *
 * @returns token
 */
export function signJWT(
  payload: JwtPayload,
  expiresIn: number | string = config.jwtExpiresIn
) {
  return sign(payload, config.jwtSecret, {
    expiresIn,
  });
}

/**
 * Verify JWT
 *
 * @param token
 *
 * @returns payload
 */
export function verifyJWT(token: string) {
  return verify(token, config.jwtSecret) as JwtPayload;
}

/**
 * Generate JWT tokens
 *
 * @param payload
 *
 * @returns tokens
 */
export function generateJWTTokens(payload: JwtPayload) {
  const accessToken = signJWT({ ...payload, tokenType: 'access' });
  const refreshToken = signJWT(
    { ...payload, tokenType: 'refresh' },
    config.jwtRefreshExpiresIn
  );

  return { accessToken, refreshToken };
}

/**
 * Re-generate JWT tokens
 *
 * @param payload
 *
 * @returns tokens
 */
export function reGenerateJWTTokens(payload: JwtPayload) {
  delete payload.iat;
  delete payload.exp;
  delete payload.tokenType;

  return generateJWTTokens(payload);
}

/**
 * Extract JWT token from request headers
 *
 * @param headers
 *
 * @returns token
 */
function extractJWTTokenFromRequestHeaders(headers: IncomingHttpHeaders) {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];

  return token || null;
}

/**
 * Extract JWT token from request
 *
 * @param req
 * @param isRefreshToken
 *
 * @returns token
 */
export function extractJWTTokenFromRequest(
  req: Request,
  isRefreshToken = false
) {
  let token = extractJWTTokenFromRequestHeaders(req.headers);

  if (!token) {
    token = getCookie(req, isRefreshToken);
  }

  return token;
}
