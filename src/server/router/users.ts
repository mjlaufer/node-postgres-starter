import express from 'express';
import * as userController from '../../controllers/user-controller';
import { signupSchema, updateUserSchema } from '../../helpers/schemas';
import asyncWrapper from '../middleware/asyncWrapper';
import {
    sanitizeId,
    sanitizeSignupCredentials,
    sanitizeUpdateUserInputs,
} from '../middleware/sanitize';
import validateSchema from '../middleware/validateSchema';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(userController.fetchUsers))
    .post(
        sanitizeSignupCredentials,
        validateSchema(signupSchema),
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(sanitizeId, asyncWrapper(userController.fetchUser))
    .put(
        sanitizeUpdateUserInputs,
        validateSchema(updateUserSchema),
        asyncWrapper(userController.updateUser),
    )
    .delete(sanitizeId, asyncWrapper(userController.deleteUser));

export default router;
