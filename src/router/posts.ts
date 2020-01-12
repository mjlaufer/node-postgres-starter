import express from 'express';
import * as postController from '../controllers/post-controller';
import asyncWrapper from '../middleware/asyncWrapper';

const router = express.Router();

router.route('/').get(asyncWrapper(postController.fetchPosts));

export default router;
