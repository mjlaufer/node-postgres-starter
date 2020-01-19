import express from 'express';
import * as userController from '../controllers/user-controller';
import { idSchema, signupSchema, updateUserSchema } from '../helpers/schemas';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeSignupCredentials, sanitizeUpdateUserInputs } from '../middleware/sanitize';
import { validateParams, validateBody } from '../middleware/validation';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(userController.fetchUsers))
    .post(
        sanitizeSignupCredentials,
        validateBody(signupSchema),
        asyncWrapper(userController.createUser),
    );

router
    .route('/:id')
    .get(validateParams(idSchema), asyncWrapper(userController.fetchUser))
    .put(
        sanitizeUpdateUserInputs,
        validateParams(idSchema),
        validateBody(updateUserSchema),
        asyncWrapper(userController.updateUser),
    )
    .delete(validateParams(idSchema), asyncWrapper(userController.deleteUser));

export default router;
