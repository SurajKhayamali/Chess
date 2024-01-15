import { Router } from 'express';

import {
  // create,
  // getAll,
  // getById,
  // update,
  // remove,
  getAllFilteredByUser,
  getByIdByUser,
  recordMove,
} from '../controllers/game.controller';
import { asyncHandler } from '../helpers/async.helper';
import { validateReqBody } from '../middlewares/validator.middleware';
// import { createGameSchema, updateGameSchema } from '../schemas/game.schema';
import { recordMoveSchema } from '../schemas/game.schema';

const router = Router();

// router.post('/', validateReqBody(createGameSchema), create);
// router.get('/', getAll);
// router.get('/:id', getById);
// router.patch('/:id', validateReqBody(updateGameSchema), update);
// router.delete('/:id', remove);

// router.post('/', validateReqBody(createGameSchema), create);
router.get('/', asyncHandler(getAllFilteredByUser));
router.get('/:id', getByIdByUser);
router.post('/:id/moves', validateReqBody(recordMoveSchema), recordMove);
// router.patch('/:id', validateReqBody(updateGameSchema), update);
// router.delete('/:id', remove

export default router;
