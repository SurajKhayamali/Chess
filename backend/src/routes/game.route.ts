import { Router } from 'express';

import {
  // create,
  // getAll,
  // getById,
  // update,
  // remove,
  getAllFilteredByUser,
} from '../controllers/game.controller';
// import { validateReqBody } from '../middlewares/validator.middleware';
// import { createGameSchema, updateGameSchema } from '../schemas/game.schema';

const router = Router();

// router.post('/', validateReqBody(createGameSchema), create);
// router.get('/', getAll);
// router.get('/:id', getById);
// router.patch('/:id', validateReqBody(updateGameSchema), update);
// router.delete('/:id', remove);

// router.post('/', validateReqBody(createGameSchema), create);
router.get('/', getAllFilteredByUser);
// router.get('/:id', getById);
// router.patch('/:id', validateReqBody(updateGameSchema), update);
// router.delete('/:id', remove

export default router;
