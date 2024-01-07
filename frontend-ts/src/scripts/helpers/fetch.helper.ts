import { API_URL } from '../constants/api.constant';

export async function fetchHelper(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
