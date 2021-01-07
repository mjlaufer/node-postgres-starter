import { Request, Response } from 'express';
import { pick } from 'lodash';
import * as userService from '../services/user-service';
import { SignupRequest, UserUpdateRequest } from '../types';

export async function fetchUsers(req: Request, res: Response): Promise<void> {
    const lastCreatedAt =
        req.query.lastCreatedAt instanceof Date ? req.query.lastCreatedAt : new Date();
    const limit = typeof req.query.limit === 'number' ? req.query.limit : 10;
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const users = await userService.fetchUsers({ lastCreatedAt, limit, order });

    res.json({ users });
}

export async function fetchUser(req: Request, res: Response): Promise<void> {
    const user = await userService.fetchUser(req.params.id);
    res.json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
    const signupRequestData: SignupRequest = pick(req.body, ['email', 'username', 'password']);

    const user = await userService.createUser(signupRequestData);

    res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    const updatedUserData: UserUpdateRequest = {
        id: req.params.id,
        ...pick(req.body, ['email', 'username']),
    };

    const updatedUser = await userService.updateUser(updatedUserData);

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
}
