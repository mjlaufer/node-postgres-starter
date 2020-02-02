import express from 'express';
import * as userController from '../controllers/user-controller';
import { idSchema, signupSchema, updateUserSchema } from '../helpers/schemas';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeEmail, createTextSanitizer } from '../middleware/sanitizers';
import { validateParams, validateBody } from '../middleware/validation';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(userController.fetchUsers))
    .post(
        [sanitizeEmail, createTextSanitizer('username')],
        validateBody(signupSchema),
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(validateParams(idSchema), asyncWrapper(userController.fetchUser))
    .put(
        [sanitizeEmail, createTextSanitizer('username')],
        validateParams(idSchema),
        validateBody(updateUserSchema),
        asyncWrapper(userController.updateUser),
    )
    .delete(validateParams(idSchema), asyncWrapper(userController.deleteUser));

export default router;
