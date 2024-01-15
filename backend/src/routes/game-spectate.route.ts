import { Router } from 'express';
import { getBySlug } from '../controllers/game-spectate.controller';
import { asyncHandler } from '../helpers/async.helper';

const router = Router();

router.get('/:slug', asyncHandler(getBySlug));

export default router;
