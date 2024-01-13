import { object, string } from 'yup';

export const createChatSchema = object({
  message: string().required('Message is required'),
  channel: string(),
});

export const updateChatSchema = object({
  message: string().required('Message is required'),
});
