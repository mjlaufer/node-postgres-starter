import { Request, Response, NextFunction } from 'express';

export type MiddlewareFunc = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void | Promise<void>;

export interface SignupRequest {
    email: string;
    username: string;
    password: string;
}

export interface SignupResponse {
    message?: string;
    user?: User;
}

export interface UserCreateRequest extends SignupRequest {
    id: string;
    role: Role;
}

export type Role = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    username: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserEntity {
    id: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: string;
    title: string;
    body: string;
    author: {
        id: string;
        username: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface PostEntity {
    id: string;
    title: string;
    body: string;
    authorId: string;
    authorUsername: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PostCreateRequest = Pick<PostEntity, 'title' | 'body'> & { userId: string };

export interface PaginationOptions {
    limit: number;
    lastCreatedAt: Date;
    order: 'ASC' | 'DESC';
}
