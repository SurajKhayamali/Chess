import { Router } from 'express';

import {
  createByUser,
  getAllByUserId,
  getByIdByUserId,
  removeByUser,
  updateByUser,
  // create,
  // getAll,
  // getById,
  // update,
  // remove,
} from '../controllers/chat.controller';
import { validateReqBody } from '../middlewares/validator.middleware';
import {
  createChatByUserSchema,
  updateChatByUserSchema,
  // createChatSchema,
  // updateChatSchema,
} from '../schemas/chat.schema';

const router = Router();

// router.post('/', validateReqBody(createChatSchema), create);
// router.get('/', getAll);
// router.get('/:id', getById);
// router.patch('/:id', validateReqBody(updateChatSchema), update);
// router.delete('/:id', remove);

router.get('/', getAllByUserId);
router.post('/', validateReqBody(createChatByUserSchema), createByUser);
router.get('/:id', getByIdByUserId);
router.patch('/:id', validateReqBody(updateChatByUserSchema), updateByUser);
router.delete('/:id', removeByUser);

export default router;
