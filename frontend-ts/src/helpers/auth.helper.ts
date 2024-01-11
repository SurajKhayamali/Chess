import { KEY_FOR_LOGGED_IN } from 'constants/localstorage.constant';
import { handleCheckIfAuthenticated } from 'services/auth.service';

export async function checkIfAuthenticated() {
  const isLoggedIn = localStorage.getItem(KEY_FOR_LOGGED_IN) === 'true';
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
