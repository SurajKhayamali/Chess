import { KEY_FOR_LOGGED_IN } from 'constants/localstorage.constant';
import { fetchHelper } from './fetch.helper';
import { AUTH_ENDPOINTS } from 'constants/endpoint.constant';

export async function checkIfAuthenticated() {
  const isLoggedIn = localStorage.getItem(KEY_FOR_LOGGED_IN) === 'true';
  if (!isLoggedIn) return { isLoggedIn: false };

  try {
    const response = await fetchHelper(AUTH_ENDPOINTS.ME);
    return { isLoggedIn: true, userInfo: response };
  } catch (error) {
    console.log(error);
    return { isLoggedIn: false };
  }
}

export async function setIsLoggedIn(isLoggedIn: boolean) {
  localStorage.setItem(KEY_FOR_LOGGED_IN, String(isLoggedIn));
}
