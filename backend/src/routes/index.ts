import { Router } from 'express';

import authRouter from './auth.route';
import userRouter from './user.route';
import gameRouter from './game.route';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', auth, userRouter);
router.use('/games', auth, gameRouter);

export default router;
