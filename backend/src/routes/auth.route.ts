import { Router } from 'express';
import {
  handleSignup,
  handleLogin,
  handleRefreshToken,
  handleLogout,
} from '../controllers/auth.controller';
import { loginSchema, signUpSchema } from '../schemas/auth.schema';
import { validateReqBody } from '../middlewares/validator.middleware';
import { asyncHandler } from '../helpers/async.helper';

const router = Router();

router.post(
  '/register',
  validateReqBody(signUpSchema),
  asyncHandler(handleSignup)
);

router.post('/login', validateReqBody(loginSchema), handleLogin);

router.post('/refresh', handleRefreshToken);

router.post('/logout', handleLogout);

export default router;
