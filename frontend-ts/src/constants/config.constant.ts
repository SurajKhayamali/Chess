const BASE_URL = 'http://localhost:5000';
const API_URL_PREFIX = '/api';

export const API_URL = import.meta.env.PROD
  ? API_URL_PREFIX
  : import.meta.env.VITE_API_URL || `${BASE_URL}/${API_URL_PREFIX}`;

export const SOCKET_URL = import.meta.env.PROD
  ? window.location.origin
  : import.meta.env.VITE_SOCKET_URL || BASE_URL;
