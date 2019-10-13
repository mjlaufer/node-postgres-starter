import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export async function fetchUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await User.findAll();
        res.send({ users });
    } catch (err) {
        next(err);
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.create(req.body);
        res.send(user);
    } catch (err) {
        next(err);
    }
}

export function fetchUser(req: Request, res: Response) {
    res.send(`Find user with ID ${req.params.id}`);
}

export function updateUser(req: Request, res: Response) {
    res.send(`Update user with ID ${req.params.id}`);
}

export function deleteUser(req: Request, res: Response) {
    res.send(`Delete user with ID ${req.params.id}`);
}
