import pgPromise from 'pg-promise';
import { SignupCredentials } from '../../../types';
import { db } from '../../db';
import UserRepository, { UserEntity } from './index';

jest.mock('../../db', () => ({
    db: {
        oneOrNone: jest.fn(),
    },
    pgp: pgPromise(),
}));

describe('UserRepository', () => {
    test('is an instance of class UserRepository', () => {
        expect(UserRepository).toEqual({ tableName: 'users' });
    });

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
});
