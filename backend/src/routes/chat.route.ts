import { Router } from 'express';

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/chat.controller';
import { validateReqBody } from '../middlewares/validator.middleware';
import { createChatSchema, updateChatSchema } from '../schemas/chat.schema';

const router = Router();

router.post('/', validateReqBody(createChatSchema), create);

router.get('/', getAll);

router.get('/:id', getById);

router.patch('/:id', validateReqBody(updateChatSchema), update);

router.delete('/:id', remove);

export default router;
