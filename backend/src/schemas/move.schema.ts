import Joi from 'joi';
import { PieceType } from '../enums/pieceType.enum';

export const createMoveSchema = Joi.object({
  game: Joi.number().required().messages({
    'number.base': 'Game must be a numeric game id value',
    'any.required': 'Game is required',
  }),
  pieceType: Joi.string()
    .valid(...Object.values(PieceType))
    .required()
    .messages({
      'any.only': `Piece type must be one of the allowed values: ${Object.values(
        PieceType
      ).join(', ')}`,
      'any.required': 'Piece type is required',
    }),
  isWhite: Joi.boolean().required().messages({
    'boolean.base': 'Is white must be a boolean value',
    'any.required': 'Is white is required',
  }),
  oldFileIndex: Joi.number().required().messages({
    'number.base': 'Old file index must be a numeric value',
    'any.required': 'Old file index is required',
  }),
  oldRankIndex: Joi.number().required().messages({
    'number.base': 'Old rank index must be a numeric value',
    'any.required': 'Old rank index is required',
  }),
  newFileIndex: Joi.number().required().messages({
    'number.base': 'New file index must be a numeric value',
    'any.required': 'New file index is required',
  }),
  newRankIndex: Joi.number().required().messages({
    'number.base': 'New rank index must be a numeric value',
    'any.required': 'New rank index is required',
  }),
  capturedPieceType: Joi.string()
    .valid(...Object.values(PieceType))
    .messages({
      'any.only': `Captured piece type must be one of the allowed values: ${Object.values(
        PieceType
      ).join(', ')}`,
    }),
});

export const updateMoveSchema = createMoveSchema.fork(
  [
    'game',
    'pieceType',
    'isWhite',
    'oldFileIndex',
    'oldRankIndex',
    'newFileIndex',
    'newRankIndex',
  ],
  (schema) => schema.optional()
);
