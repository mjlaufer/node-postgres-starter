import { identity, pick } from 'lodash';
import pgPromise from 'pg-promise';
import db from '@db';
import { hash } from '@features/user/user-helpers';
import * as generate from '@test/utils/generate';
import { InternalServerError } from '@errors';
import { SignupRequest, UserEntity } from '@types';
import * as userService from '../user/user-service';
import * as authService from './auth-service';

jest.mock('@db', () => ({
    users: {
        findOne: jest.fn(),
    },
    pgp: pgPromise(),
}));

const mockSignupRequest: SignupRequest = {
    email: generate.email(),
    username: generate.username(),
    password: generate.password(),
};

const mockUserEntity: UserEntity = {
    id: generate.id(),
    email: mockSignupRequest.email,
    username: mockSignupRequest.username,
    password: hash(mockSignupRequest.password),
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('#authService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('signup', async () => {
        const mockUser = generate.user(mockSignupRequest);
        jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

        expect.assertions(5);

        const { user } = await authService.signup(mockSignupRequest);
        expect(user).toEqual(mockUser);
        expect(db.users.findOne).toHaveBeenCalledWith(pick(mockSignupRequest, 'email'));
        expect(db.users.findOne).toHaveBeenCalledTimes(1);
        expect(userService.createUser).toHaveBeenCalledWith(mockSignupRequest);
        expect(userService.createUser).toHaveBeenCalledTimes(1);
    });

    test('signup: user already exists', async () => {
        db.users.findOne = jest.fn().mockResolvedValue(mockUserEntity);

        expect.assertions(4);

        const { message } = await authService.signup(mockSignupRequest);
        expect(message).toBe(authService.USER_EXISTS_MESSAGE);
        expect(db.users.findOne).toHaveBeenCalledWith(pick(mockSignupRequest, 'email'));
        expect(db.users.findOne).toHaveBeenCalledTimes(1);
        expect(userService.createUser).not.toHaveBeenCalled();
    });

    test('signup: fail', async () => {
        const MOCK_ERROR_MESSAGE = 'mock error message';
        jest.spyOn(userService, 'createUser').mockRejectedValue(MOCK_ERROR_MESSAGE);

        expect.assertions(5);

        const err = await authService.signup(mockSignupRequest).catch(identity);
        expect(err).toEqual(new InternalServerError(MOCK_ERROR_MESSAGE));
        expect(db.users.findOne).toHaveBeenCalledWith(pick(mockSignupRequest, 'email'));
        expect(db.users.findOne).toHaveBeenCalledTimes(1);
        expect(userService.createUser).toHaveBeenCalledWith(mockSignupRequest);
        expect(userService.createUser).toHaveBeenCalledTimes(1);
    });
});
