import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, 'First name must be at least 3 characters long')
    .max(30, 'First name must be at most 30 characters long')
    .required('First name is required'),
  middleName: yup.string().max(30, 'Middle name must be at most 30 characters'),
  lastName: yup
    .string()
    .min(3, 'Last name must be at least 3 characters long')
    .max(30, 'Last name must be at most 30 characters long')
    .required('Last name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(
      /^[a-zA-Z0-9_]*$/,
      'Username must only contain letters, numbers, and underscores'
    )
    .required('Username is required'),
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const loginSchema = yup.object().shape({
  emailOrUsername: yup
    .string()
    .test({
      name: 'emailOrUsername',
      message: 'Email or username must be either a valid email or a username',
      test: (value) => {
        if (!value) return false;
        const isEmail = yup.string().email().isValidSync(value);
        const isUsername = yup
          .string()
          .min(3)
          .max(30)
          .matches(/^[a-zA-Z0-9_]*$/)
          .isValidSync(value);
        return isEmail || isUsername;
      },
    })
    .required('Email or username is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, 'Old password must be at least 8 characters')
    .required('Old password is required'),
  newPassword: yup
    .string()
    .min(8, 'New password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('newPassword')],
      'New Password and Confirm Password must match'
    )
    .required('Confirm password is required'),
});
