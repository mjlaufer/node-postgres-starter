import { db } from '../../db';
import { HttpError } from '../../helpers/errors';
import User from './index';

jest.mock('../../db', () => ({
    db: {
        any: jest.fn(),
        none: jest.fn(),
        one: jest.fn(),
        oneOrNone: jest.fn(),
    },
}));

describe('User model', () => {
    const testCredentials = {
        email: 'test@test.com',
        username: 'test_user',
        password: 'test',
    };

    const mockUser = {
        id: 1,
        email: testCredentials.email,
        username: testCredentials.username,
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
    };

    describe('#findAll', () => {
        test('returns a list of all users', async () => {
            db.any = jest.fn().mockResolvedValue([mockUser]);

            expect.assertions(2);

            const users = await User.findAll();

            expect(db.any).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.any = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.findAll()).rejects.toThrow(new HttpError('Database error'));
        });
    });

    describe('#findById', () => {
        test('returns the correct user', async () => {
            db.one = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(2);

            const user = await User.findById(mockUser.id);

            expect(db.one).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.findById(mockUser.id)).rejects.toThrow(
                new HttpError('Database error'),
            );
        });
    });

    describe('#findOne', () => {
        test('can find a user by email', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(2);

            const user = await User.findOne({ email: mockUser.email });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        });

        test('can find a user by username', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(2);

            const user = await User.findOne({ username: mockUser.username });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.oneOrNone = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.findOne({ email: mockUser.email })).rejects.toThrow(
                new HttpError('Database error'),
            );
        });
    });

    describe('#create', () => {
        test('inserts and returns a new user', async () => {
            db.one = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(2);

            const newUser = await User.create(testCredentials);

            expect(db.one).toHaveBeenCalled();
            expect(newUser).toEqual(mockUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.create(mockUser)).rejects.toThrow(new HttpError('Database error'));
        });
    });

    describe('#update', () => {
        const updatedUser = {
            ...mockUser,
            username: 'updated_user',
        };

        test('updates and returns a user', async () => {
            db.one = jest.fn().mockResolvedValue(updatedUser);

            expect.assertions(2);

            const user = await User.update({
                ...mockUser,
                username: 'updated_user',
            });

            expect(db.one).toHaveBeenCalled();
            expect(user).toEqual(updatedUser);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.update(mockUser)).rejects.toThrow(new HttpError('Database error'));
        });
    });

    describe('#destroy', () => {
        test('deletes the correct user', async () => {
            db.none = jest.fn();

            expect.assertions(1);

            await User.destroy(mockUser.id);

            expect(db.none).toHaveBeenCalled();
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.none = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.destroy(mockUser.id)).rejects.toThrow(
                new HttpError('Database error'),
            );
        });
    });
});
