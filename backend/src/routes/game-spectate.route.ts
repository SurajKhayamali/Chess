import { Router } from 'express';
import { getBySlug } from '../controllers/game-spectate.controller';

const router = Router();

router.get('/:slug', getBySlug);

export default router;
