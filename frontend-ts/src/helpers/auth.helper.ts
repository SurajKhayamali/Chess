import {
  KEY_FOR_LOGGED_IN,
  KEY_FOR_USER_INFO,
} from 'constants/localstorage.constant';
import { NavigationMode } from 'enums/route.enum';
import { JwtDecodedPayload } from 'interfaces/jwt.interface';
import { handleNavigation } from 'scripts/router';
import { handleCheckIfAuthenticated } from 'services/auth.service';

export function getIsLoggedIn() {
  return localStorage.getItem(KEY_FOR_LOGGED_IN) === 'true';
}

export async function checkIfAuthenticated() {
  const isLoggedIn = getIsLoggedIn();
  if (!isLoggedIn) return { isLoggedIn: false };

  try {
    const response = await handleCheckIfAuthenticated();
    return { isLoggedIn: true, userInfo: response };
  } catch (error) {
    console.log(error);
    return { isLoggedIn: false };
  }
}

export async function setIsLoggedIn(isLoggedIn: boolean) {
  localStorage.setItem(KEY_FOR_LOGGED_IN, String(isLoggedIn));
}

export function setUserInfo(userInfo: JwtDecodedPayload) {
  localStorage.setItem(KEY_FOR_USER_INFO, JSON.stringify(userInfo));
}

export function getUserInfo(): JwtDecodedPayload | null {
  const userInfo = localStorage.getItem(KEY_FOR_USER_INFO);
  if (!userInfo) return null;

  return JSON.parse(userInfo);
}

export function clearUserInfo() {
  localStorage.removeItem(KEY_FOR_USER_INFO);
}

export async function loggedInOnlyGuard() {
  const isLoggedIn = getIsLoggedIn();
  if (isLoggedIn) return;

  handleNavigation('/auth/login', NavigationMode.REPLACE);
}

export async function loggedOutOnlyGuard() {
  const isLoggedIn = getIsLoggedIn();
  if (!isLoggedIn) return;

  handleNavigation('/', NavigationMode.REPLACE);
}
