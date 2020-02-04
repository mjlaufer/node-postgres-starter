import express from 'express';
import * as userController from '../controllers/user-controller';
import { idSchema, signupSchema, updateUserSchema, paginationSchema } from '../helpers/validation';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeEmail, sanitizeText, sanitizePaginationOptions } from '../middleware/sanitizers';
import { validateQuery, validateParams, validateBody } from '../middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(
        sanitizePaginationOptions,
        validateQuery(paginationSchema),
        asyncWrapper(userController.fetchUsers),
    )
    .post(
        sanitizeEmail,
        sanitizeText('username'),
        validateBody(signupSchema),
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(validateParams(idSchema), asyncWrapper(userController.fetchUser))
    .put(
        sanitizeEmail,
        sanitizeText('username'),
        validateParams(idSchema),
        validateBody(updateUserSchema),
        asyncWrapper(userController.updateUser),
    )
    .delete(validateParams(idSchema), asyncWrapper(userController.deleteUser));

export default router;
