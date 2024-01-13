import { NextFunction, Request, Response } from 'express';

import * as authService from '../services/auth.service';
import { LoginDto, SignupDto } from '../interfaces/auth.interface';
import { extractJWTTokenFromRequest } from '../helpers/jwt.helper';
import { clearCookie, setCookie } from '../helpers/cookie.helper';
import { AuthenticatedRequest } from '../interfaces/jwt.interface';
import { UnauthorizedException } from '../exceptions';

/**
 * Handle signup request
 *
 * @param req
 * @param res
 */
export async function handleSignup(req: Request, res: Response) {
  const signupDto = req.body as SignupDto;

  const { user, tokens } = await authService.handleSignup(signupDto);
  const { accessToken, refreshToken } = tokens;

  setCookie(res, accessToken);
  setCookie(res, refreshToken, true);

  return res.json({
    message: 'Signup successful!',
    data: { user, accessToken },
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
    const { user, tokens } = await authService.handleLogin(loginDto);
    const { accessToken, refreshToken } = tokens;

    setCookie(res, accessToken);
    setCookie(res, refreshToken, true);

    return res.json({
      message: 'Login successful!',
      data: { user, accessToken },
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

export async function checkAuth(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new UnauthorizedException('User not found!');

  return res.json(req.user);
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const changePasswordDto = req.body;

  if (!userId) throw new UnauthorizedException('User not found!');

  await authService.changePassword(userId, changePasswordDto);

  return res.json({
    message: 'Password updated!',
  });
}
