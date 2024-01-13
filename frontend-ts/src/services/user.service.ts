import { USER_ENDPOINTS } from 'constants/endpoint.constant';
import { HttpMethods } from 'enums/http.enum';
import { fetchHelper } from 'helpers/fetch.helper';
import { UpdateUserDto, User } from 'interfaces/user.interface';

export async function getUserInfo(): Promise<User> {
  const response = await fetchHelper(USER_ENDPOINTS.GET_USER_INFO);

  return response;
}

export async function updateUserInfo(body: UpdateUserDto): Promise<User> {
  const response = await fetchHelper(USER_ENDPOINTS.UPDATE_USER_INFO, {
    method: HttpMethods.PATCH,
    body: JSON.stringify(body),
  });

  return response;
}
