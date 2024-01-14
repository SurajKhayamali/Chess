import { Router } from 'express';

import authRouter from './auth.route';
import userRouter from './user.route';
import gameRouter from './game.route';
import gameSpectateRouter from './game-spectate.route';
import moveRouter from './move.route';
import chatRouter from './chat.route';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', auth, userRouter);
router.use('/games', auth, gameRouter);
router.use('/games-spectate', gameSpectateRouter);
router.use('/moves', auth, moveRouter);
router.use('/chats', auth, chatRouter);

export default router;
