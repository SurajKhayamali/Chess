import { Router } from 'express';

import {
  // create,
  getAll,
  getById,
  update,
  remove,
  getOnlineUsers,
  messageUser,
} from '../controllers/user.controller';
import { validateReqBody } from '../middlewares/validator.middleware';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

// router.post('/', create);

router.get('/', getAll);

router.get('/online', getOnlineUsers);

router.get('/:id', getById);

router.post('/:id/message', messageUser);

router.patch('/:id', validateReqBody(updateUserSchema), update);

router.delete('/:id', remove);

export default router;
