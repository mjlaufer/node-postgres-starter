import { Request, Response } from 'express';

export function findAll(req: Request, res: Response) {
    res.send('Find all users');
}

export function create(req: Request, res: Response) {
    res.send('Create a user');
}

export function findById(req: Request, res: Response) {
    res.send(`Find user with ID ${req.params.id}`);
}

export function update(req: Request, res: Response) {
    res.send(`Update user with ID ${req.params.id}`);
}

export function destroy(req: Request, res: Response) {
    res.send(`Delete user with ID ${req.params.id}`);
}
