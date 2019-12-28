import { Request, Response } from 'express';
import { pick } from 'lodash';
import { SignupCredentials, UserData } from '../types';
import User from '../model/User';
import * as userService from '../model/services/user-service';

export async function fetchUsers(req: Request, res: Response): Promise<void> {
    const users: User[] = await userService.fetchUsers();
    res.json({ users });
}

export async function fetchUser(req: Request, res: Response): Promise<void> {
    const user: User = await userService.fetchUser(+req.params.id);
    res.json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
    const credentials: SignupCredentials = pick(req.body, ['email', 'username', 'password']);

    const user: User = await userService.createUser(credentials);

    res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    const id = +req.params.id;
    const updatedUserData: UserData = {
        id,
        ...pick(req.body, ['email', 'username', 'password']),
    };

    const updatedUser: User = await userService.updateUser(updatedUserData);

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    await userService.deleteUser(+req.params.id);
    res.status(204).end();
}
