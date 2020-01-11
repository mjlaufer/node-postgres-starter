import User from './model/User';

export interface LoginCredentials {
    [key: string]: string | undefined;
    email?: string;
    username?: string;
}

export interface SignupCredentials {
    email: string;
    username: string;
    password: string;
}

export interface SignupResponse {
    message?: string;
    user?: User;
}

export interface UserData {
    id: number;
    email?: string;
    username?: string;
    password?: string;
}

export interface UserEntity {
    id: number;
    email: string;
    username: string;
    password: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
}

export interface PostEntity {
    id: number;
    title: string;
    body: string;
    username: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
}
