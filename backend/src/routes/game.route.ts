import { Router } from 'express';

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/game.controller';
import { validateReqBody } from '../middlewares/validator.middleware';
import { createGameSchema } from '../schemas/game.schema';

const router = Router();

router.post('/', validateReqBody(createGameSchema), create);

router.get('/', getAll);

router.get('/:id', getById);

router.patch('/:id', update);

router.delete('/:id', remove);

export default router;
