import Joi from 'joi';
// import { validateFen } from 'chess.js';
import { GameMode } from '../enums/gameMode.enum';
import { Chess } from 'chess.js';

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
  // initialBoardState: Joi.string()
  //   .custom((value, helper) => {
  //     if (!validateFen(value).ok) {
  //       return helper.error('string.invalidFen');
  //     }

  //     return value;
  //   })
  //   .messages({
  //     'string.base': 'Initial board state must be a string value',
  //     'string.invalidFen': 'Initial board state must be a valid FEN notation',
  //   }),
  pgn: Joi.string()
    .custom((value, helper) => {
      try {
        const chess = new Chess();
        chess.loadPgn(value);

        return value;
      } catch (error) {
        return helper.error('string.invalidPgn');
      }
    })
    .messages({
      'string.base': 'PGN must be a string value',
      'string.invalidPgn': 'PGN must be a valid FEN notation',
    }),
  // pgn: Joi.string().messages({
  //   'string.base': 'PGN must be a string value',
  // }),
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

export const recordMoveSchema = Joi.object({
  from: Joi.string()
    .length(2)
    .pattern(/[a-h][1-8]/)
    .required()
    .messages({
      'string.base': 'From must be a string value',
      'string.length': 'From must be exactly 2 characters long',
      'string.pattern.base': 'From must be a valid chess board square',
      'any.required': 'From is required',
    }),
  to: Joi.string()
    .length(2)
    .pattern(/[a-h][1-8]/)
    .required()
    .messages({
      'string.base': 'To must be a string value',
      'string.length': 'To must be exactly 2 characters long',
      'string.pattern.base': 'To must be a valid chess board square',
      'any.required': 'To is required',
    }),
});
