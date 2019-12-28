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

export interface UserData {
    id: number;
    email?: string;
    username?: string;
    password?: string;
}

export interface PostData {
    title: string;
    body: string;
    userId: number;
}
