import { API_URL } from 'constants/config.constant';
import { HttpStatusCode } from 'enums/http.enum';
import { handleRefresh } from 'services/auth.service';

export async function fetchHelper(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (res.status === HttpStatusCode.UNAUTHORIZED) {
    try {
      await handleRefresh();
      console.log('Refreshed token');

      return fetchHelper(url, options);
    } catch (error) {
      // throw new Error(error as string);
      console.log('Failed to refresh token');

      // TODO: Hit backend logout endpoint and Redirect to login page
    }
  }
  const result = await res.json();

  if (result.error) throw new Error(result.error);

  return result;
}
