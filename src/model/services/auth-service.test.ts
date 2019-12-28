import pgPromise from 'pg-promise';
import { HttpError } from '../../errors';
import { SignupCredentials, UserEntity } from '../../types';
import User from '../User';
import * as userService from './user-service';
import * as authService from './auth-service';
import { db } from '../db';

jest.mock('../db', () => ({
    db: {
        users: {
            findOne: jest.fn(),
        },
    },
    pgp: pgPromise(),
}));

describe('AuthService', () => {
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
        created_at: '',
        modified_at: '',
        deleted_at: null,
    };

    const mockUser = new User(mockUserEntity);

    describe('#signup', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        test('creates a new user', async () => {
            jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

            expect.assertions(1);

            await expect(authService.signup(mockSignupCredentials)).resolves.toEqual({
                user: mockUser,
            });
        });

        test('returns a message if the provided email or username is associated with an existing user', async () => {
            db.users.findOne = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(1);

            await expect(authService.signup(mockSignupCredentials)).resolves.toEqual({
                message: authService.USER_EXISTS_MESSAGE,
            });
        });

        test('throws an HttpError if unsuccessful', async () => {
            jest.spyOn(userService, 'createUser').mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(authService.signup(mockSignupCredentials)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
