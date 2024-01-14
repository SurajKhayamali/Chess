export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOG_IN: '/auth/login',
  LOG_OUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/password',
};

export const USER_ENDPOINTS = {
  GET_USER_INFO: '/users',
  UPDATE_USER_INFO: '/users',
};

export const CHAT_ENDPOINTS = {
  CREATE: '/chats',
  GET_ALL: '/chats',
  GET_BY_ID: (id: number) => `/chats/${id}`,
  UPDATE_BY_ID: (id: number) => `/chats/${id}`,
  DELETE_BY_ID: (id: number) => `/chats/${id}`,
};

export const GAMES_ENDPOINTS = {
  CREATE: '/games',
  GET_ALL: '/games',
  GET_BY_ID: (id: number) => `/games/${id}`,
  GET_BY_SLUG: (slug: string) => `/games?slug=${slug}`,
  UPDATE_BY_ID: (id: number) => `/games/${id}`,
  DELETE_BY_ID: (id: number) => `/games/${id}`,
};
