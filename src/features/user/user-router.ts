import express from 'express';
import * as userController from '@features/user/user-controller';
import asyncWrapper from '@middleware/asyncWrapper';
import { sanitizeEmail, sanitizeText, sanitizePaginationOptions } from '@middleware/sanitizers';
import requireAuth from '@middleware/requireAuth';
import {
    validateIdParam,
    validatePaginationQuery,
    validateSignupCredentials,
    validateUserUpdate,
} from '@middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(
        sanitizePaginationOptions,
        validatePaginationQuery,
        asyncWrapper(userController.fetchUsers),
    )
    .post(
        requireAuth('admin'),
        sanitizeEmail,
        sanitizeText('username'),
        validateSignupCredentials,
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(validateIdParam, asyncWrapper(userController.fetchUser))
    .put(
        requireAuth('user'),
        sanitizeEmail,
        sanitizeText('username'),
        validateIdParam,
        validateUserUpdate,
        asyncWrapper(userController.updateUser),
    )
    .delete(requireAuth('user'), validateIdParam, asyncWrapper(userController.deleteUser));

export default router;
