import express from 'express';
import * as postController from '../controllers/post-controller';
import { paginationSchema, idSchema } from '../helpers/validation';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeText, sanitizePaginationOptions } from '../middleware/sanitizers';
import { validateQuery, validateParams } from '../middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(
        sanitizePaginationOptions,
        validateQuery(paginationSchema),
        asyncWrapper(postController.fetchPosts),
    )
    .post(sanitizeText(['title', 'body']), asyncWrapper(postController.createPost));

router
    .route('/:id')
    .get(asyncWrapper(postController.fetchPost))
    .put(
        sanitizeText(['title', 'body']),
        validateParams(idSchema),
        asyncWrapper(postController.updatePost),
    )
    .delete(validateParams(idSchema), asyncWrapper(postController.deletePost));

export default router;
