import { AUTH_ENDPOINTS } from 'scripts/constants/endpoint,constant';
import { setIsLoggedIn } from 'scripts/helpers/auth.helper';
import { fetchHelper } from 'scripts/helpers/fetch.helper';

export async function handleLogout() {
  await fetchHelper(AUTH_ENDPOINTS.LOG_OUT, {
    method: 'POST',
  });

  setIsLoggedIn(false);
}
