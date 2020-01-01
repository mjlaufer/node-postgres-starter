import { Request, Response } from 'express';
import { pick } from 'lodash';
import { SignupCredentials, UserData } from '../types';
import UserService, { User } from '../model/services/UserService';

export default class UserController {
    static async fetchUsers(req: Request, res: Response): Promise<void> {
        const users: User[] = await UserService.findAllUsers();
        res.send({ users });
    }

    static async fetchUser(req: Request, res: Response): Promise<void> {
        const user: User = await UserService.findUser(+req.params.id);
        res.send(user);
    }

    static async createUser(req: Request, res: Response): Promise<void> {
        const credentials: SignupCredentials = pick(req.body, ['email', 'username', 'password']);

        const user: User = await UserService.createUser(credentials);

        res.status(201).send(user);
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        const id = +req.params.id;
        const updatedUserData: UserData = {
            id,
            ...pick(req.body, ['email', 'username', 'password']),
        };

        const updatedUser: User = await UserService.updateUser(updatedUserData);

        res.send(updatedUser);
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        await UserService.deleteUser(+req.params.id);
        res.status(204).end();
    }
}
