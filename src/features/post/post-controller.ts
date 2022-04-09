import { Request, Response } from 'express';
import { pick } from 'lodash';
import * as postService from '@features/post/post-service';
import asyncWrapper from '@middleware/asyncWrapper';
import { User } from '@types';

export const fetchPosts = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const lastCreatedAt =
        req.query.lastCreatedAt instanceof Date ? req.query.lastCreatedAt : new Date();
    const limit = typeof req.query.limit === 'number' ? req.query.limit : 10;
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const posts = await postService.fetchPosts({ lastCreatedAt, limit, order });
    res.json({ posts });
});

export const fetchPost = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const post = await postService.fetchPost(req.params.id);
    res.json(post);
});

export const createPost = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const postRequestData = pick(req.body, ['title', 'body', 'userId']);
    const post = await postService.createPost(postRequestData);
    res.status(201).json(post);
});

export const updatePost = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const data = {
        id: req.params.id,
        ...pick(req.body, ['title', 'body']),
    };
    const updatedPost = await postService.updatePost({
        requestor: req.user as User,
        data,
    });
    res.json(updatedPost);
});

export const deletePost = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    await postService.deletePost({
        requestor: req.user as User,
        data: {
            id: req.params.id,
        },
    });
    res.status(204).end();
});
