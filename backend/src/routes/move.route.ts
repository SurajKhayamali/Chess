import { Router } from 'express';

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/move.controller';
// import { validateReqBody } from '../middlewares/validator.middleware';
// import { updateUserSchema } from '../schemas/move.schema';

const router = Router();

router.post('/', create);

router.get('/', getAll);

router.get('/:id', getById);

router.patch('/:id', update);

router.delete('/:id', remove);

export default router;
