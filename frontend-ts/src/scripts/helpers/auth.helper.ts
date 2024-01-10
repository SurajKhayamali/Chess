// import { JwtDecodedPayload } from 'scripts/interfaces/jwt.interface';
import { KEY_FOR_LOGGED_IN } from 'scripts/constants/localstorage.constant';
import { fetchHelper } from './fetch.helper';

// let isLoggedIn = true; // assume user is logged in by default to check
// let userInfo: JwtDecodedPayload | null = null;

export async function checkIfAuthenticated() {
  const isLoggedIn = localStorage.getItem(KEY_FOR_LOGGED_IN) === 'true';
  if (!isLoggedIn) return { isLoggedIn: false };

  try {
    const response = await fetchHelper('/auth/me');
    return { isLoggedIn: true, userInfo: response };
  } catch (error) {
    console.log(error);
    return { isLoggedIn: false };
  }
}

export async function setIsLoggedIn(isLoggedIn: boolean) {
  localStorage.setItem(KEY_FOR_LOGGED_IN, String(isLoggedIn));
}
