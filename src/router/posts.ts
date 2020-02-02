import express from 'express';
import * as postController from '../controllers/post-controller';
import { idSchema } from '../helpers/validation';
import asyncWrapper from '../middleware/asyncWrapper';
import { createTextSanitizer } from '../middleware/sanitizers';
import { validateParams } from '../middleware/validators';

const router = express.Router();

router
    .route('/')
    .get(asyncWrapper(postController.fetchPosts))
    .post(
        [createTextSanitizer('title'), createTextSanitizer('body')],
        asyncWrapper(postController.createPost),
    );

router
    .route('/:id')
    .get(asyncWrapper(postController.fetchPost))
    .put(
        [createTextSanitizer('title'), createTextSanitizer('body')],
        validateParams(idSchema),
        asyncWrapper(postController.updatePost),
    )
    .delete(validateParams(idSchema), asyncWrapper(postController.deletePost));

export default router;
