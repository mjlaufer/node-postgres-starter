import { HttpError } from '../../helpers/errors';
import { SignupCredentials, UserData } from '../../types';
import UserRepository, { UserEntity } from '../repositories/user';
import UserService, { User } from './user';

jest.mock('../repositories/user');

describe('UserService', () => {
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
    };

    const mockUser = new User(mockUserEntity);

    describe('#findAllUsers', () => {
        test('returns a list of all users', async () => {
            UserRepository.findAll = jest.fn().mockResolvedValue([mockUserEntity]);

            expect.assertions(2);

            const users = await UserService.findAllUsers();

            expect(UserRepository.findAll).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserRepository.findAll = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(UserService.findAllUsers()).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#findUser', () => {
        test('returns the correct user', async () => {
            UserRepository.findById = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const user = await UserService.findUser(mockUserEntity.id);

            expect(UserRepository.findById).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserRepository.findById = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(UserService.findUser(mockUserEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#createUser', () => {
        test('inserts and returns a new user', async () => {
            UserRepository.create = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const newUser = await UserService.createUser(mockSignupCredentials);

            expect(UserRepository.create).toHaveBeenCalled();
            expect(newUser).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserRepository.create = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(UserService.createUser(mockSignupCredentials)).rejects.toThrow(
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
            UserRepository.findById = jest.fn().mockResolvedValue(mockUserEntity);
            UserRepository.update = jest.fn().mockResolvedValue(updatedUserEntity);

            expect.assertions(3);

            const user = await UserService.updateUser(updatedUserData);

            expect(UserRepository.findById).toHaveBeenCalled();
            expect(UserRepository.update).toHaveBeenCalled();
            expect(user).toEqual(new User(updatedUserEntity));
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserRepository.update = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(UserService.updateUser(mockUserEntity)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#deleteUser', () => {
        test('deletes the correct user', async () => {
            UserRepository.destroy = jest.fn();

            expect.assertions(1);

            await UserService.deleteUser(mockUserEntity.id);

            expect(UserRepository.destroy).toHaveBeenCalled();
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserRepository.destroy = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(UserService.deleteUser(mockUserEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
