import { Request, Response } from 'express';
import * as PostService from '../model/services/post-service';

export async function fetchPosts(req: Request, res: Response): Promise<void> {
    const posts = await PostService.fetchPosts();
    res.json({ posts });
}
