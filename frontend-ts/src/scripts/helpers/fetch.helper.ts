import { API_URL } from '../constants/api.constant';

export async function fetchHelper(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();

  if (result.error) throw new Error(result.error);

  return result;
}
