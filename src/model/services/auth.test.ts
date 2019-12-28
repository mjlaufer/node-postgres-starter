import { HttpError } from '../../errors';
import { SignupCredentials } from '../../types';
import UserRepository, { UserEntity } from '../repositories/UserRepository';
import AuthService, { USER_EXISTS_MESSAGE } from '../services/auth';
import UserService, { User } from './user';

jest.mock('../repositories/UserRepository', () => ({
    findOne: jest.fn().mockResolvedValue(null),
}));

jest.mock('../services/user');

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
    };

    const mockUser = new User(mockUserEntity);

    describe('#signup', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        test('creates a new user', async () => {
            UserService.createUser = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(1);

            await expect(AuthService.signup(mockSignupCredentials)).resolves.toEqual({
                user: mockUser,
            });
        });

        test('returns a message if the provided email or username is associated with an existing user', async () => {
            UserRepository.findOne = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(1);

            await expect(AuthService.signup(mockSignupCredentials)).resolves.toEqual({
                message: USER_EXISTS_MESSAGE,
            });
        });

        test('throws an HttpError if unsuccessful', async () => {
            UserService.createUser = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(AuthService.signup(mockSignupCredentials)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
