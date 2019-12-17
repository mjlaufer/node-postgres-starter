import pgPromise from 'pg-promise';
import { db } from '../../../db';
import { SignupCredentials } from '../../../types';
import UserRepository, { UserEntity } from './index';

jest.mock('../../../db', () => ({
    db: {
        any: jest.fn(),
        none: jest.fn(),
        one: jest.fn(),
        oneOrNone: jest.fn(),
    },
    pgp: pgPromise(),
}));

describe('UserRepository', () => {
    const mockSignupCredentials: SignupCredentials = {
        email: 'test@test.com',
        username: 'test_user',
        password: 'test',
    };

    const mockUserEntity: UserEntity = {
        id: 1,
        email: mockSignupCredentials.email,
        username: mockSignupCredentials.username,
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
    };

    describe('#findAll', () => {
        test('returns a list of all users', async () => {
            db.any = jest.fn().mockResolvedValue([mockUserEntity]);

            expect.assertions(2);

            const userEntities: UserEntity[] = await UserRepository.findAll();

            expect(db.any).toHaveBeenCalled();
            expect(userEntities).toEqual([mockUserEntity]);
        });
    });

    describe('#findById', () => {
        test('returns the correct user', async () => {
            db.one = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const userEntity: UserEntity = await UserRepository.findById(mockUserEntity.id);

            expect(db.one).toHaveBeenCalled();
            expect(userEntity).toEqual(mockUserEntity);
        });
    });

    describe('#findOne', () => {
        test('can find a user by email', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const userEntity = await UserRepository.findOne({
                email: mockUserEntity.email,
            });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(userEntity).toEqual(mockUserEntity);
        });

        test('can find a user by username', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const userEntity = await UserRepository.findOne({
                username: mockUserEntity.username,
            });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(userEntity).toEqual(mockUserEntity);
        });

        test('can find a user by email and username', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const userEntity = await UserRepository.findOne({
                email: mockUserEntity.email,
                username: mockUserEntity.username,
            });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(userEntity).toEqual(mockUserEntity);
        });
    });

    describe('#create', () => {
        test('inserts and returns a new user', async () => {
            db.one = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(2);

            const newUserEntity: UserEntity = await UserRepository.create(mockSignupCredentials);

            expect(db.one).toHaveBeenCalled();
            expect(newUserEntity).toEqual(mockUserEntity);
        });
    });

    describe('#update', () => {
        const updatedUserEntity = {
            ...mockUserEntity,
            username: 'updated_user',
        };

        test('updates and returns a user', async () => {
            db.one = jest.fn().mockResolvedValue(updatedUserEntity);

            expect.assertions(2);

            const userEntity: UserEntity = await UserRepository.update({
                ...mockUserEntity,
                username: 'updated_user',
            });

            expect(db.one).toHaveBeenCalled();
            expect(userEntity).toEqual(updatedUserEntity);
        });
    });

    describe('#destroy', () => {
        test('deletes the correct user', async () => {
            db.none = jest.fn();

            expect.assertions(1);

            await UserRepository.destroy(mockUserEntity.id);

            expect(db.none).toHaveBeenCalled();
        });
    });
});
