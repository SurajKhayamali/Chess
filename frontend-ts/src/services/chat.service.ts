import { CHAT_ENDPOINTS } from 'constants/endpoint.constant';
import { Chat } from 'entities/Chat';
import { HttpMethods } from 'enums/http.enum';
import { fetchHelper } from 'helpers/fetch.helper';
import { CreateChatDto, UpdateChatDto } from 'interfaces/chat.interface';

export async function createChat(createChatDto: CreateChatDto): Promise<Chat> {
  const response = await fetchHelper(CHAT_ENDPOINTS.CREATE, {
    method: HttpMethods.POST,
    body: JSON.stringify(createChatDto),
  });

  return response;
}

export async function getChats(): Promise<Chat[]> {
  const response = await fetchHelper(CHAT_ENDPOINTS.GET_ALL);

  return response;
}

export async function getChat(id: number): Promise<Chat> {
  const response = await fetchHelper(CHAT_ENDPOINTS.GET_BY_ID(id));

  return response;
}

export async function updateChat(
  id: number,
  updateChatDto: UpdateChatDto
): Promise<Chat> {
  const response = await fetchHelper(CHAT_ENDPOINTS.UPDATE_BY_ID(id), {
    method: HttpMethods.PATCH,
    body: JSON.stringify(updateChatDto),
  });

  return response;
}

export async function deleteChat(id: number): Promise<Chat> {
  const response = await fetchHelper(CHAT_ENDPOINTS.DELETE_BY_ID(id), {
    method: HttpMethods.DELETE,
  });

  return response;
}
