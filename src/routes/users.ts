import express from 'express';
import * as userController from '../controllers/user';

const router = express.Router();

router
    .route('/')
    .get(userController.findAll)
    .post(userController.create);

router
    .route('/:id')
    .get(userController.findById)
    .put(userController.update)
    .delete(userController.destroy);

export default router;
