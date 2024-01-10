import { fetchHelper } from './fetch.helper';

export async function checkIfAuthenticated() {
  try {
    const response = await fetchHelper('/auth/me');
    return { isLoggedIn: true, userInfo: response };
  } catch (error) {
    console.log(error);
    return { isLoggedIn: false };
  }
}
