import express from 'express';
import * as userController from '../controllers/user-controller';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeEmail, sanitizeText, sanitizePaginationOptions } from '../middleware/sanitizers';
import {
    validateIdParam,
    validatePaginationQuery,
    validateSignupCredentials,
    validateUserUpdate,
} from '../middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(
        sanitizePaginationOptions,
        validatePaginationQuery,
        asyncWrapper(userController.fetchUsers),
    )
    .post(
        sanitizeEmail,
        sanitizeText('username'),
        validateSignupCredentials,
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(validateIdParam, asyncWrapper(userController.fetchUser))
    .put(
        sanitizeEmail,
        sanitizeText('username'),
        validateIdParam,
        validateUserUpdate,
        asyncWrapper(userController.updateUser),
    )
    .delete(validateIdParam, asyncWrapper(userController.deleteUser));

export default router;
