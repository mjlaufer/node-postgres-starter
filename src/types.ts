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

export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
}

export interface UserEntity {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    modifiedAt: Date;
}

export type UserUpdateRequest = Partial<UserEntity> & { id: string };

export interface Post {
    id: string;
    title: string;
    body: string;
    author: string;
    createdAt: Date;
}

export interface PostEntity {
    id: string;
    title: string;
    body: string;
    username: string;
    createdAt: Date;
    modifiedAt: Date;
}

type HasTitleAndBody = Pick<PostEntity, 'title' | 'body'>;

export type PostCreateRequest = HasTitleAndBody & { userId: string };

export type PostUpdateRequest = Partial<HasTitleAndBody> & { id: string };

export interface PaginationOptions {
    limit: number;
    lastCreatedAt: Date;
    order: 'ASC' | 'DESC';
}
