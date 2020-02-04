import { Request, Response } from 'express';
import User from '../model/User';
import * as userService from '../model/services/user-service';
import * as userController from './user-controller';

const mockUuid = '00000000-0000-0000-0000-000000000000';

describe('userController', () => {
    const mockUser: User = {
        id: mockUuid,
        email: 'test@test.com',
        username: 'username',
        createdAt: new Date(),
    };
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        res.json = jest.fn();
        res.status = jest.fn(() => res);
        res.end = jest.fn();
    });

    describe('#fetchUsers', () => {
        test('retrieves a list of users', async () => {
            const fetchUsers = jest.spyOn(userService, 'fetchUsers').mockResolvedValue([mockUser]);
            req.query = {};

            expect.assertions(2);

            await userController.fetchUsers(req, res);

            expect(fetchUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ users: [mockUser] });
        });
    });

    describe('#fetchUser', () => {
        test('retrieves the correct user', async () => {
            const fetchUser = jest.spyOn(userService, 'fetchUser').mockResolvedValue(mockUser);
            req.params = { id: mockUuid };

            expect.assertions(2);

            await userController.fetchUser(req, res);

            expect(fetchUser).toHaveBeenCalledWith(mockUser.id);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('#createUser', () => {
        const data = {
            email: 'test@test.com',
            username: 'username',
        };

        test('creates a new user', async () => {
            const createUser = jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);
            req.body = data;

            expect.assertions(2);

            await userController.createUser(req, res);

            expect(createUser).toHaveBeenCalledWith(data);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('#updateUser', () => {
        const data = {
            username: 'updated_user',
        };

        test('updates a user', async () => {
            const updateUser = jest
                .spyOn(userService, 'updateUser')
                .mockResolvedValue({ ...mockUser, ...data });
            req.params = { id: mockUuid };
            req.body = data;

            expect.assertions(2);

            await userController.updateUser(req, res);

            expect(updateUser).toHaveBeenCalledWith({
                id: mockUuid,
                ...data,
            });
            expect(res.json).toHaveBeenCalledWith({ ...mockUser, ...data });
        });
    });

    describe('#deleteUser', () => {
        test('deletes a user', async () => {
            const deleteUser = jest.spyOn(userService, 'deleteUser').mockResolvedValue();
            req.params = { id: mockUuid };

            expect.assertions(2);

            await userController.deleteUser(req, res);

            expect(deleteUser).toHaveBeenCalledWith(mockUser.id);
            expect(res.end).toHaveBeenCalled();
        });
    });
});
