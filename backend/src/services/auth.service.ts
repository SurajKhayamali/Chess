import { LoginDto, SignupDto } from '../interfaces/auth.interface';
import * as userService from './user.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../exceptions';
import {
  comparePassword,
  hashPassowrd,
} from '../helpers/passwordHasher.helper';
import {
  generateJWTTokens,
  reGenerateJWTTokens,
  verifyJWT,
} from '../helpers/jwt.helper';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * Handle signup request
 *
 * @param signupDto
 *
 * @returns tokens
 */
export async function handleSignup(signupDto: SignupDto) {
  const { password, ...rest } = signupDto;
  const hashedPassword = await hashPassowrd(password);

  const user = await userService.create({
    ...rest,
    password: hashedPassword,
  });

  return generateJWTTokens({ userId: user.id });
}

/**
 * Handle login request
 *
 * @param loginDto
 *
 * @returns tokens
 */
export async function handleLogin(loginDto: LoginDto) {
  const { emailOrUsername, password } = loginDto;
  const user = await userService.getByEmailOrUsername(emailOrUsername);

  if (!user) {
    throw new NotFoundException('User not found!');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new BadRequestException('Invalid password!');
  }

  return generateJWTTokens({ userId: user.id });
}

/**
 * Handle logout request
 *
 * @param req
 * @param res
 */
export async function handleRefreshToken(refreshToken: string) {
  try {
    const payload = verifyJWT(refreshToken);

    if (payload.tokenType !== 'refresh') throw new Error('Invalid token type!');

    return reGenerateJWTTokens(payload);
    // return userService.getAllUsers();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedException(error.message);
    }

    throw new UnauthorizedException(
      (error as Error)?.message || 'Invalid refresh token!'
    );
  }
}
