import express from 'express';
import * as userController from '@features/user/user-controller';
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
    .get(sanitizePaginationOptions, validatePaginationQuery, userController.fetchUsers)
    .post(
        requireAuth('admin'),
        sanitizeEmail,
        sanitizeText('username'),
        validateSignupCredentials,
        userController.createUser,
    );

router
    .route('/:id')
    .get(validateIdParam, userController.fetchUser)
    .put(
        requireAuth('user'),
        sanitizeEmail,
        sanitizeText('username'),
        validateIdParam,
        validateUserUpdate,
        userController.updateUser,
    )
    .delete(requireAuth('user'), validateIdParam, userController.deleteUser);

export default router;
