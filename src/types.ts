import { Request, Response, NextFunction } from 'express';
import User from './model/User';

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

export interface UserUpdateRequest {
    id: string;
    email?: string;
    username?: string;
    password?: string;
}

export interface UserEntity {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
}

export interface PostCreateRequest {
    title: string;
    body: string;
    userId: string;
}

export interface PostUpdateRequest {
    id: string;
    title?: string;
    body?: string;
}

export interface PostEntity {
    id: string;
    title: string;
    body: string;
    username: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
}
