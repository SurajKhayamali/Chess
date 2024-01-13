import Joi from 'joi';

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).messages({
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 30 characters long',
    'any.required': 'First name is required',
  }),
  middleName: Joi.string().max(30).allow(null).messages({
    'string.min': 'Middle name must be at least 3 characters long',
    'string.max': 'Middle name must be at most 30 characters long',
  }),
  lastName: Joi.string().min(3).max(30).messages({
    'string.min': 'Last name must be at least 3 characters long',
    'string.max': 'Last name must be at most 30 characters long',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email',
  }),
  username: Joi.string().min(3).max(20).alphanum().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be at most 20 characters long',
    'string.alphanum': 'Username must contain only alphanumeric characters',
  }),
});
