import pgPromise from 'pg-promise';
import { HttpError } from '../../errors';
import { SignupCredentials, UserData, UserEntity } from '../../types';
import { db } from '../db';
import User from '../User';
import * as userService from './user-service';

jest.mock('../db', () => ({
    db: {
        users: {},
    },
    pgp: pgPromise(),
}));

describe('userService', () => {
    const mockSignupCredentials: SignupCredentials = {
        email: 'user@test.com',
        username: 'username',
        password: 'password',
    };

    const mockUserEntity: UserEntity = {
        id: 1,
        email: mockSignupCredentials.email,
        username: mockSignupCredentials.username,
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
        createdAt: '',
        modifiedAt: '',
        deletedAt: null,
    };

    const mockUser = new User(mockUserEntity);

    describe('#fetchUsers', () => {
        test('returns a list of all users', async () => {
            db.users.findAll = jest.fn().mockResolvedValue([mockUserEntity]);

            expect.assertions(2);

            const users = await userService.fetchUsers();

            expect(db.users.findAll).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.users.findAll = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(userService.fetchUsers()).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#fetchUser', () => {
        test('returns the correct user', async () => {
            db.users.findById = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const user = await userService.fetchUser(mockUserEntity.id);

            expect(db.users.findById).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.users.findById = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(userService.fetchUser(mockUserEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#createUser', () => {
        test('inserts and returns a new user', async () => {
            db.users.create = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const newUser = await userService.createUser(mockSignupCredentials);

            expect(db.users.create).toHaveBeenCalled();
            expect(newUser).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.users.create = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(userService.createUser(mockSignupCredentials)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#updateUser', () => {
        const updatedUserData: UserData = {
            id: 1,
            username: 'updated_user',
            password: 'updated_password',
        };

        const updatedUserEntity: UserEntity = {
            ...mockUserEntity,
            ...updatedUserData,
            password: '',
        };

        test('updates and returns a user', async () => {
            db.users.findById = jest.fn().mockResolvedValue(mockUserEntity);
            db.users.update = jest.fn().mockResolvedValue(updatedUserEntity);

            expect.assertions(3);

            const user = await userService.updateUser(updatedUserData);

            expect(db.users.findById).toHaveBeenCalled();
            expect(db.users.update).toHaveBeenCalled();
            expect(user).toEqual(new User(updatedUserEntity));
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.users.update = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(userService.updateUser(mockUserEntity)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#deleteUser', () => {
        test('deletes the correct user', async () => {
            db.users.destroy = jest.fn();

            expect.assertions(1);

            await userService.deleteUser(mockUserEntity.id);

            expect(db.users.destroy).toHaveBeenCalled();
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.users.destroy = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(userService.deleteUser(mockUserEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
