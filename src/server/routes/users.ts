import express from 'express';
import UserController from '../../controllers/user';
import asyncWrapper from '../middleware/asyncWrapper';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(UserController.fetchUsers))
    .post(asyncWrapper(UserController.createUser));

router
    .route('/:id')
    .get(asyncWrapper(UserController.fetchUser))
    .put(asyncWrapper(UserController.updateUser))
    .delete(asyncWrapper(UserController.deleteUser));

export default router;
