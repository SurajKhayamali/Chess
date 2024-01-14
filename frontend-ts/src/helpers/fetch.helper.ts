import { API_URL } from 'constants/config.constant';
import { HttpStatusCode } from 'enums/http.enum';
import { handleLogout, handleRefresh } from 'services/auth.service';
import { getIsLoggedIn } from './auth.helper';

export async function fetchHelper(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (res.status === HttpStatusCode.UNAUTHORIZED && getIsLoggedIn()) {
    try {
      await handleRefresh();
      // console.log('Refreshed token');

      return fetchHelper(url, options);
    } catch (error) {
      // console.log('Failed to refresh token');

      await handleLogout();
      // console.log('Logged out');
    }
  }
  const result = await res.json();

  if (result.error) throw new Error(result.error);

  return result;
}
