import * as yup from 'yup';

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
