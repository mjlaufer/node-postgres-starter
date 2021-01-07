import { Request, Response } from 'express';
import { pick } from 'lodash';
import * as postService from '../services/post-service';
import { PostCreateRequest, PostUpdateRequest } from '../types';

export async function fetchPosts(req: Request, res: Response): Promise<void> {
    const lastCreatedAt =
        req.query.lastCreatedAt instanceof Date ? req.query.lastCreatedAt : new Date();
    const limit = typeof req.query.limit === 'number' ? req.query.limit : 10;
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const posts = await postService.fetchPosts({ lastCreatedAt, limit, order });

    res.json({ posts });
}

export async function fetchPost(req: Request, res: Response): Promise<void> {
    const post = await postService.fetchPost(req.params.id);
    res.json(post);
}

export async function createPost(req: Request, res: Response): Promise<void> {
    const postRequestData: PostCreateRequest = pick(req.body, ['title', 'body', 'userId']);

    const post = await postService.createPost(postRequestData);

    res.status(201).json(post);
}

export async function updatePost(req: Request, res: Response): Promise<void> {
    const updatedPostData: PostUpdateRequest = {
        id: req.params.id,
        ...pick(req.body, ['title', 'body']),
    };

    const updatedPost = await postService.updatePost(updatedPostData);

    res.json(updatedPost);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
    await postService.deletePost(req.params.id);
    res.status(204).end();
}
