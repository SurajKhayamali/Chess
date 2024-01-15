import { CHAT_ENDPOINTS } from 'constants/endpoint.constant';
import { Chat } from 'entities/Chat';
import { HttpMethods } from 'enums/http.enum';
import { SocketEvent } from 'enums/socket.enum';
import { fetchHelper } from 'helpers/fetch.helper';
import { emit } from 'helpers/socket.helper';
import {
  CreateChatDto,
  QueryChatDto,
  UpdateChatDto,
} from 'interfaces/chat.interface';
import { socket } from 'scripts/socket';

export async function createChat(createChatDto: CreateChatDto): Promise<Chat> {
  // const response = await fetchHelper(CHAT_ENDPOINTS.CREATE, {
  //   method: HttpMethods.POST,
  //   body: JSON.stringify(createChatDto),
  // });

  const response = (await emit(
    socket,
    SocketEvent.PUBLIC_MESSAGE,
    createChatDto
  )) as Chat;

  return response;
}

export async function getChats(queryChatDto?: QueryChatDto): Promise<Chat[]> {
  const query = new URLSearchParams(queryChatDto as Record<string, string>);
  const response = await fetchHelper(CHAT_ENDPOINTS.GET_ALL + '?' + query);

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
