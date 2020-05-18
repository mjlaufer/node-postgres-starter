import { Request, Response } from 'express';
import { pick } from 'lodash';
import { SignupRequest, UserUpdateRequest } from '../types';
import User from '../model/User';
import * as userService from '../model/services/user-service';

export async function fetchUsers(req: Request, res: Response): Promise<void> {
    const lastCreatedAt =
        req.query.lastCreatedAt instanceof Date ? req.query.lastCreatedAt : new Date();
    const limit = typeof req.query.limit === 'number' ? req.query.limit : 10;
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const users: User[] = await userService.fetchUsers({ lastCreatedAt, limit, order });

    res.json({ users });
}

export async function fetchUser(req: Request, res: Response): Promise<void> {
    const user: User = await userService.fetchUser(req.params.id);
    res.json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
    const signupRequestData: SignupRequest = pick(req.body, ['email', 'username', 'password']);

    const user: User = await userService.createUser(signupRequestData);

    res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    const updatedUserData: UserUpdateRequest = {
        id: req.params.id,
        ...pick(req.body, ['email', 'username', 'password']),
    };

    const updatedUser: User = await userService.updateUser(updatedUserData);

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
}
