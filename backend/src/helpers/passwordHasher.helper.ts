import { compare, hash } from 'bcrypt';
import config from '../config';

/**
 * Hash password
 *
 * @param password
 *
 * @returns hashed password
 */
export function hashPassowrd(password: string) {
  return hash(password, config.saltRounds);
}

/**
 * Compare password
 *
 * @param password
 * @param hashedPassword
 *
 * @returns password match
 */
export function comparePassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}
