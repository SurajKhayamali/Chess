import { KEY_FOR_LOGGED_IN } from 'constants/localstorage.constant';
import { NavigationMode } from 'enums/route.enum';
import { handleNavigation } from 'scripts/router';
import { handleCheckIfAuthenticated } from 'services/auth.service';

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

export function getIsLoggedIn() {
  return localStorage.getItem(KEY_FOR_LOGGED_IN) === 'true';
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
