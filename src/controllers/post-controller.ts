import { Request, Response } from 'express';
import { pick } from 'lodash';
import * as postService from '../model/services/post-service';
import Post from '../model/Post';
import { PostCreateRequest, PostUpdateRequest } from '../types';

export async function fetchPosts(req: Request, res: Response): Promise<void> {
    const { lastCreatedAt = new Date(), limit = 10, order = 'DESC' } = req.query;

    const posts = await postService.fetchPosts({ lastCreatedAt, limit, order });

    res.json({ posts });
}

export async function fetchPost(req: Request, res: Response): Promise<void> {
    const post: Post = await postService.fetchPost(req.params.id);
    res.json(post);
}

export async function createPost(req: Request, res: Response): Promise<void> {
    const postRequestData: PostCreateRequest = pick(req.body, ['title', 'body', 'userId']);

    const post: Post = await postService.createPost(postRequestData);

    res.status(201).json(post);
}

export async function updatePost(req: Request, res: Response): Promise<void> {
    const updatedPostData: PostUpdateRequest = {
        id: req.params.id,
        ...pick(req.body, ['title', 'body']),
    };

    const updatedPost: Post = await postService.updatePost(updatedPostData);

    res.json(updatedPost);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
    await postService.deletePost(req.params.id);
    res.status(204).end();
}
