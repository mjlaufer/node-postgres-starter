import { identity, pick } from 'lodash';
import pgPromise from 'pg-promise';
import db from '@db';
import { hash, makeUser } from '@helpers/user';
import * as generate from '@test/utils/generate';
import { HttpError } from '@utils/errors';
import { SignupRequest, User, UserUpdateRequest, UserEntity, PaginationOptions } from '@types';
import * as userService from './user-service';

jest.mock('@db', () => ({
    users: {},
    pgp: pgPromise(),
}));

describe('userService', () => {
    const mockUserId = generate.id();

    const paginationOptions: PaginationOptions = {
        lastCreatedAt: new Date(),
        limit: 10,
        order: 'DESC',
    };

    const mockSignupRequest: SignupRequest = {
        email: generate.email(),
        username: generate.username(),
        password: generate.password(),
    };

    const mockUserEntity: UserEntity = {
        id: mockUserId,
        email: mockSignupRequest.email,
        username: mockSignupRequest.username,
        password: hash(mockSignupRequest.password),
        role: 'user',
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    const mockUser: User = makeUser(mockUserEntity);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('fetchUsers', async () => {
        db.users.findAll = jest.fn().mockResolvedValue([mockUserEntity]);

        expect.assertions(3);

        const users = await userService.fetchUsers(paginationOptions);

        expect(db.users.findAll).toHaveBeenCalledWith(paginationOptions);
        expect(db.users.findAll).toHaveBeenCalledTimes(1);
        expect(users).toEqual([mockUser]);
    });

    test('fetchUsers: fail', async () => {
        db.users.findAll = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await userService.fetchUsers(paginationOptions).catch(identity);
        expect(err).toEqual(new HttpError('mock error message'));
        expect(db.users.findAll).toHaveBeenCalledTimes(1);
    });

    test('fetchUser', async () => {
        db.users.findById = jest.fn().mockResolvedValue(mockUserEntity);

        expect.assertions(3);

        const user = await userService.fetchUser(mockUserEntity.id);

        expect(db.users.findById).toHaveBeenCalledWith(mockUserEntity.id);
        expect(db.users.findById).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
    });

    test('fetchUser: fail', async () => {
        db.users.findById = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await userService.fetchUser(mockUserEntity.id).catch(identity);
        expect(err).toEqual(new HttpError('mock error message'));
        expect(db.users.findById).toHaveBeenCalledTimes(1);
    });

    test('createUser', async () => {
        db.users.create = jest.fn().mockResolvedValue(mockUserEntity);

        expect.assertions(3);

        const newUser = await userService.createUser(mockSignupRequest);

        expect(db.users.create).toHaveBeenCalledWith(
            expect.objectContaining(pick(mockSignupRequest, ['email', 'username'])), // This object will also contain an id and a hashed password.
        );
        expect(db.users.create).toHaveBeenCalledTimes(1);
        expect(newUser).toEqual(mockUser);
    });

    test('createUser: fail', async () => {
        db.users.create = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await userService.createUser(mockSignupRequest).catch(identity);
        expect(err).toEqual(new HttpError('mock error message'));
        expect(db.users.create).toHaveBeenCalledTimes(1);
    });

    test('updateUser', async () => {
        const updatedUserData: UserUpdateRequest = {
            id: mockUserId,
            username: generate.username(),
            password: generate.password(),
        };

        const updatedUserEntity: UserEntity = {
            ...mockUserEntity,
            ...updatedUserData,
        };

        db.users.findById = jest.fn().mockResolvedValue(mockUserEntity);
        db.users.update = jest.fn().mockResolvedValue(updatedUserEntity);

        expect.assertions(5);

        const user = await userService.updateUser(updatedUserData);

        expect(db.users.findById).toHaveBeenCalledWith(mockUserId);
        expect(db.users.findById).toHaveBeenCalledTimes(1);
        expect(db.users.update).toHaveBeenCalledWith(
            expect.objectContaining(pick(updatedUserEntity, 'id, email, username')), // Omit password because it is hashed in the db.
        );
        expect(db.users.update).toHaveBeenCalledTimes(1);
        expect(user).toEqual(userService.makeUser(updatedUserEntity));
    });

    test('updateUser: fail', async () => {
        db.users.update = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await userService.updateUser(mockUserEntity).catch(identity);
        expect(err).toEqual(new HttpError('mock error message'));
        expect(db.users.update).toHaveBeenCalledTimes(1);
    });

    test('deleteUser', async () => {
        db.users.destroy = jest.fn();

        expect.assertions(2);

        await userService.deleteUser(mockUserEntity.id);

        expect(db.users.destroy).toHaveBeenCalledWith(mockUserEntity.id);
        expect(db.users.destroy).toHaveBeenCalledTimes(1);
    });

    test('deleteUser: fail', async () => {
        db.users.destroy = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await userService.deleteUser(mockUserEntity.id).catch(identity);
        expect(err).toEqual(new HttpError('mock error message'));
        expect(db.users.destroy).toHaveBeenCalledTimes(1);
    });
});
