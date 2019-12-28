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
    created_at: string;
    modified_at: string;
    deleted_at: string | null;
}

export interface PostEntity {
    id: number;
    title: string;
    body: string;
    username: string;
    created_at: string;
    modified_at: string;
    deleted_at: string | null;
}
