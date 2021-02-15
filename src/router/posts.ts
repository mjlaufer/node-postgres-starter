import express from 'express';
import * as postController from '@controllers/post-controller';
import asyncWrapper from '@middleware/asyncWrapper';
import requireAuth from '@middleware/requireAuth';
import { sanitizeText, sanitizePaginationOptions } from '@middleware/sanitizers';
import {
    validateIdParam,
    validatePaginationQuery,
    validatePostUpdate,
} from '@middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(
        sanitizePaginationOptions,
        validatePaginationQuery,
        asyncWrapper(postController.fetchPosts),
    )
    .post(
        requireAuth('user'),
        sanitizeText(['title', 'body']),
        asyncWrapper(postController.createPost),
    );

router
    .route('/:id')
    .get(asyncWrapper(postController.fetchPost))
    .put(
        requireAuth('user'),
        sanitizeText(['title', 'body']),
        validateIdParam,
        validatePostUpdate,
        asyncWrapper(postController.updatePost),
    )
    .delete(requireAuth('user'), validateIdParam, asyncWrapper(postController.deletePost));

export default router;
