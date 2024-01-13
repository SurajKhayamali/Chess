import { Router } from 'express';
import {
  handleSignup,
  handleLogin,
  handleRefreshToken,
  handleLogout,
  checkAuth,
  changePassword,
} from '../controllers/auth.controller';
import {
  loginSchema,
  signUpSchema,
  changePasswordSchema,
} from '../schemas/auth.schema';
import { validateReqBody } from '../middlewares/validator.middleware';
import { asyncHandler } from '../helpers/async.helper';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  validateReqBody(signUpSchema),
  asyncHandler(handleSignup)
);

router.post('/login', validateReqBody(loginSchema), handleLogin);

router.post('/refresh', handleRefreshToken);

router.post('/logout', handleLogout);

router.get('/me', auth, checkAuth);

router.patch(
  '/password',
  auth,
  validateReqBody(changePasswordSchema),
  asyncHandler(changePassword)
);

export default router;
