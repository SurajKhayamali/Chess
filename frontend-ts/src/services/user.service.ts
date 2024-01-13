import { USER_ENDPOINTS } from 'constants/endpoint.constant';
import { fetchHelper } from 'helpers/fetch.helper';
import { UpdateUserDto, User } from 'interfaces/user.interface';

export async function getUserInfo(): Promise<User> {
  const response = await fetchHelper(USER_ENDPOINTS.GET_USER_INFO);

  return response;
}

export async function updateUserInfo(body: UpdateUserDto): Promise<User> {
  const response = await fetchHelper(USER_ENDPOINTS.UPDATE_USER_INFO, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  return response;
}

export async function updateUserPassword(body: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  await fetchHelper(USER_ENDPOINTS.UPDATE_USER_PASSWORD, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
