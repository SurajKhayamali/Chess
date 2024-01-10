import { API_URL } from '../constants/api.constant';

async function refreshToken() {
  // INFO: Using fetch instead of fetchHelper to avoid infinite loop
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (response.status !== 200) throw new Error('Failed to refresh token');

  return response.json();
}

export async function fetchHelper(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (res.status === 401) {
    try {
      await refreshToken();
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
