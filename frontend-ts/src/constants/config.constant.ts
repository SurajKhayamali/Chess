const API_URL_PREFIX = '/api';

export const API_URL = import.meta.env.PROD
  ? API_URL_PREFIX
  : import.meta.env.VITE_API_URL || `http://localhost:5000/${API_URL_PREFIX}`;
