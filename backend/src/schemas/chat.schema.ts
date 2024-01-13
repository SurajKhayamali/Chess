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
  channel: Joi.string().min(3).max(30).messages({
    'string.base': 'Channel must be a string value',
    'string.min': 'Channel must be at least 3 characters long',
    'string.max': 'Channel must be at most 30 characters long',
  }),
  message: Joi.string().required().messages({
    'string.base': 'Message must be a string value',
    'any.required': 'Message is required',
  }),
});

export const createChatByUserSchema = createChatSchema.fork(
  ['sender'],
  (schema) =>
    schema.forbidden().messages({
      'any.unknown': 'Sender is forbidden',
    })
);

export const updateChatSchema = createChatSchema.fork(
  ['sender', 'message'],
  (schema) => schema.optional()
);

export const updateChatByUserSchema = createChatByUserSchema
  .fork(['message'], (schema) => schema.optional())
  .fork(['channel'], (schema) =>
    schema.forbidden().messages({
      'any.unknown': 'Channel is forbidden',
    })
  );
