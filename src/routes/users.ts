import express from 'express';
import * as userController from '../controllers/user';

const router = express.Router();

router
    .route('/')
    .get(userController.fetchUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.fetchUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

export default router;
