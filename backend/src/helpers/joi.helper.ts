import { Schema } from 'joi';

export function validateSchema<T>(schema: Schema, data: T) {
  const { error, value } = schema.validate(data);
  if (error) {
    throw error;
  }
  return value as T;
}
