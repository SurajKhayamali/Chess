import { Router } from 'express';

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/move.controller';
import { validateReqBody } from '../middlewares/validator.middleware';
import { createMoveSchema, updateMoveSchema } from '../schemas/move.schema';

const router = Router();

router.post('/', validateReqBody(createMoveSchema), create);

router.get('/', getAll);

router.get('/:id', getById);

router.patch('/:id', validateReqBody(updateMoveSchema), update);

router.delete('/:id', remove);

export default router;
