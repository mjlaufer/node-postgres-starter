import { Request, Response } from 'express';
import UserService, { User } from '../model/services/user';
import UserController from './user';

jest.mock('../model/services/user');

describe('user controller', () => {
    const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'username',
    };
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        res.send = jest.fn();
        res.status = jest.fn(() => res);
        res.end = jest.fn();
    });

    describe('#fetchUsers', () => {
        test('retrieves a list of users', async () => {
            UserService.findAllUsers = jest.fn().mockResolvedValue([mockUser]);

            expect.assertions(2);

            await UserController.fetchUsers(req, res);

            expect(UserService.findAllUsers).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ users: [mockUser] });
        });
    });

    describe('#fetchUser', () => {
        test('retrieves the correct user', async () => {
            UserService.findUser = jest.fn().mockResolvedValue(mockUser);
            req.params = { id: '1' };

            expect.assertions(2);

            await UserController.fetchUser(req, res);

            expect(UserService.findUser).toHaveBeenCalledWith(mockUser.id);
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('#createUser', () => {
        const data = {
            email: 'test@test.com',
            username: 'username',
        };

        test('creates a new user', async () => {
            UserService.createUser = jest.fn().mockResolvedValue(mockUser);
            req.body = data;

            expect.assertions(2);

            await UserController.createUser(req, res);

            expect(UserService.createUser).toHaveBeenCalledWith(data);
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('#updateUser', () => {
        const data = {
            username: 'updated_user',
        };

        test('updates a user', async () => {
            UserService.updateUser = jest
                .fn()
                .mockResolvedValue({ ...mockUser, username: data.username });
            req.params = { id: '1' };
            req.body = data;

            expect.assertions(2);

            await UserController.updateUser(req, res);

            expect(UserService.updateUser).toHaveBeenCalledWith({
                id: 1,
                username: data.username,
            });
            expect(res.send).toHaveBeenCalledWith({ ...mockUser, username: data.username });
        });
    });

    describe('#deleteUser', () => {
        test('deletes a user', async () => {
            UserService.deleteUser = jest.fn();
            req.params = { id: '1' };

            expect.assertions(2);

            await UserController.deleteUser(req, res);

            expect(UserService.deleteUser).toHaveBeenCalledWith(mockUser.id);
            expect(res.end).toHaveBeenCalled();
        });
    });
});
