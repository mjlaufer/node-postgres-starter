import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

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
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await User.update(req.body);
        res.send(user);
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
