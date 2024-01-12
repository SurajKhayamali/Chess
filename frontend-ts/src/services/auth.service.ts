import { API_URL } from 'constants/config.constant';
import { AUTH_ENDPOINTS } from 'constants/endpoint.constant';
import { SocketEvent } from 'enums/socket.enum';
import { setIsLoggedIn } from 'helpers/auth.helper';
import { fetchHelper } from 'helpers/fetch.helper';
import { emit } from 'helpers/socket.helper';
import { LoginDto, SignupDto, UserOnlineDto } from 'interfaces/auth.interface';
import { socket } from 'scripts/socket';

export async function handleRegister(body: SignupDto) {
  const response = await fetchHelper(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  reconnectAsAuthenticatedUser(response.data.user.id);

  setIsLoggedIn(true);
}

export async function handleLogin(body: LoginDto) {
  const response = await fetchHelper(AUTH_ENDPOINTS.LOG_IN, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  reconnectAsAuthenticatedUser(response.data.user.id);

  setIsLoggedIn(true);
}

export async function handleLogout() {
  await fetchHelper(AUTH_ENDPOINTS.LOG_OUT, {
    method: 'POST',
  });

  reconnectAsUnauthenticatedUser();

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

export async function handleCheckIfAuthenticated() {
  const response = await fetchHelper(AUTH_ENDPOINTS.ME);

  // console.log('Notifying user online', response);
  if (response.userId) {
    reconnectAsAuthenticatedUser(response.userId);
  }
  return response;
}

// Socket methods
function notifyUserOnline(userId: number) {
  emit(socket, SocketEvent.USER_ONLINE, { userId } satisfies UserOnlineDto);
}

function reconnectAsAuthenticatedUser(userId: number) {
  socket.disconnect();
  socket.connect();
  notifyUserOnline(userId);
}

function reconnectAsUnauthenticatedUser() {
  socket.disconnect();
  socket.connect();
}
