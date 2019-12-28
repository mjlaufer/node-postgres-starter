import express from 'express';
import * as userController from '../../controllers/user-controller';
import asyncWrapper from '../middleware/asyncWrapper';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(userController.fetchUsers))
    .post(asyncWrapper(userController.createUser));

router
    .route('/:id')
    .get(asyncWrapper(userController.fetchUser))
    .put(asyncWrapper(userController.updateUser))
    .delete(asyncWrapper(userController.deleteUser));

export default router;
