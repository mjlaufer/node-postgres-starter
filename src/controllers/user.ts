import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import User, { UserIdentity } from '../models/User';
import { SignupCredentials } from './auth';

export async function fetchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users = await User.findAll();
        res.send({ users });
    } catch (err) {
        next(err);
    }
}

export async function fetchUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await User.findById(+req.params.id);
        res.send(user);
    } catch (err) {
        next(err);
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const credentials: SignupCredentials = pick(req.body, ['email', 'username', 'password']);

        const user = await User.create(credentials);

        res.status(201).send(user);
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const currentUser: UserIdentity = pick(req.body, ['id', 'email', 'username', 'password']);

        const updatedUser = await User.update(currentUser);

        res.send(updatedUser);
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await User.destroy(+req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}
