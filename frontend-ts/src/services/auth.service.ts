import { API_URL } from 'scripts/constants/config.constant';
import { AUTH_ENDPOINTS } from 'scripts/constants/endpoint.constant';
import { setIsLoggedIn } from 'scripts/helpers/auth.helper';
import { fetchHelper } from 'scripts/helpers/fetch.helper';
import { LoginDto, SignupDto } from 'scripts/interfaces/auth.interface';

export async function handleRegister(body: SignupDto) {
  await fetchHelper(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  setIsLoggedIn(true);
}

export async function handleLogin(body: LoginDto) {
  await fetchHelper(AUTH_ENDPOINTS.LOG_IN, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  setIsLoggedIn(true);
}

export async function handleLogout() {
  await fetchHelper(AUTH_ENDPOINTS.LOG_OUT, {
    method: 'POST',
  });

  setIsLoggedIn(false);
}

export async function handleRefresh() {
  // INFO: Using fetch instead of fetchHelper to avoid infinite loop
  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REFRESH}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (response.status !== 200) {
    setIsLoggedIn(false);
    throw new Error('Failed to refresh token');
  }

  setIsLoggedIn(true);
  return response.json();
}
