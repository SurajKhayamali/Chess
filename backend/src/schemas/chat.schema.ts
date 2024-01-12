import Joi from 'joi';

export const createChatSchema = Joi.object({
  sender: Joi.number().required().messages({
    'number.base': 'Sender must be a numeric user id value',
    'any.required': 'Sender is required',
  }),
  receiver: Joi.number().messages({
    'number.base': 'Receiver must be a numeric user id value',
  }),
  game: Joi.number().messages({
    'number.base': 'Game must be a numeric game id value',
  }),
  message: Joi.string().required().messages({
    'string.base': 'Message must be a string value',
    'any.required': 'Message is required',
  }),
});

export const updateChatSchema = createChatSchema.fork(
  ['sender', 'message'],
  (schema) => schema.optional()
);
