import Joi from 'joi';
import { validateFen } from 'chess.js';
import { GameMode } from '../enums/gameMode.enum';

export const createGameSchema = Joi.object({
  slug: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Slug must be at least 3 characters long',
    'string.max': 'Slug must be at most 30 characters long',
    'string.base': 'Slug must be a string value',
    'any.required': 'Slug is required',
  }),
  whitePlayer: Joi.number().messages({
    'number.base': 'White player must be a numeric player id value',
  }),
  blackPlayer: Joi.number().messages({
    'number.base': 'Black player must be a numeric player id value',
  }),
  gameMode: Joi.string()
    .valid(...Object.values(GameMode))
    .messages({
      'any.only': `Game mode must be one of the allowed values: ${Object.values(
        GameMode
      ).join(', ')}`,
    }),
  timeLimit: Joi.number().messages({
    'number.base': 'Time limit must be a numeric value',
  }),
  initialBoardState: Joi.string()
    .custom((value, helper) => {
      if (!validateFen(value).ok) {
        return helper.error('string.invalidFen');
      }

      return value;
    })
    .messages({
      'string.base': 'Initial board state must be a string value',
      'string.invalidFen': 'Initial board state must be a valid FEN notation',
    }),
  isGameOver: Joi.boolean().messages({
    'boolean.base': 'Is game over must be a boolean value',
  }),
  hasWhitePlayerWon: Joi.boolean().messages({
    'boolean.base': 'Is game over must be a boolean value',
  }),
});

export const updateGameSchema = createGameSchema.fork(['slug'], (schema) =>
  schema.optional()
);

export const joinGameQueueSchema = Joi.object({
  timeLimit: Joi.number().messages({
    'number.base': 'Time limit must be a numeric value',
  }),
});

export const leaveGameQueueSchema = joinGameQueueSchema;
