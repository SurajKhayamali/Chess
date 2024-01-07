import { NextFunction, Request, Response } from 'express';

import * as authService from '../services/auth.service';
import { LoginDto, SignupDto } from '../interfaces/auth.interface';
import { extractJWTTokenFromRequest } from '../helpers/jwt.helper';
import { clearCookie, setCookie } from '../helpers/cookie.helper';

/**
 * Handle signup request
 *
 * @param req
 * @param res
 */
export async function handleSignup(req: Request, res: Response) {
  const signupDto = req.body as SignupDto;

  const { accessToken, refreshToken } = await authService.handleSignup(
    signupDto
  );

  setCookie(res, accessToken);
  setCookie(res, refreshToken, true);

  return res.json({
    message: 'Signup successful!',
    data: { accessToken },
  });
}

/**
 * Handle login request
 *
 * @param req
 * @param res
 * @param next
 */
export async function handleLogin(
  req: Request<unknown, unknown, LoginDto>,
  res: Response,
  next: NextFunction
) {
  const loginDto = req.body;

  try {
    const { accessToken, refreshToken } = await authService.handleLogin(
      loginDto
    );

    setCookie(res, accessToken);
    setCookie(res, refreshToken, true);

    return res.json({
      message: 'Login successful!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle refresh token request
 *
 * @param req
 * @param res
 * @param next
 */
export async function handleRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshTokenFromRequest = extractJWTTokenFromRequest(req, true);
  if (!refreshTokenFromRequest)
    return next(new Error('Refresh token not found!'));

  try {
    const { accessToken, refreshToken } = await authService.handleRefreshToken(
      refreshTokenFromRequest
    );

    setCookie(res, accessToken);
    setCookie(res, refreshToken, true);

    return res.json({
      message: 'Token refreshed!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle logout request
 *
 * @param req
 * @param res
 */
export async function handleLogout(_req: Request, res: Response) {
  clearCookie(res);

  return res.json({
    message: 'Logout successful!',
  });
}
