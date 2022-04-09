import express from 'express';
import * as postController from '@features/post/post-controller';
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
    .get(sanitizePaginationOptions, validatePaginationQuery, postController.fetchPosts)
    .post(requireAuth('user'), sanitizeText(['title', 'body']), postController.createPost);

router
    .route('/:id')
    .get(postController.fetchPost)
    .put(
        requireAuth('user'),
        sanitizeText(['title', 'body']),
        validateIdParam,
        validatePostUpdate,
        postController.updatePost,
    )
    .delete(requireAuth('user'), validateIdParam, postController.deletePost);

export default router;
