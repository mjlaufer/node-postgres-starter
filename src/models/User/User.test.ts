import { db } from '../../db';
import { HttpError } from '../../helpers/errors';
import User from './index';

jest.mock('../../db', () => ({
    db: {
        any: jest.fn(),
        none: jest.fn(),
        one: jest.fn(),
    },
}));

describe('User model', () => {
    const mockUser = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
    };

    describe('#findAll', () => {
        test('returns a list of all users', async () => {
            db.any = jest.fn().mockResolvedValue([mockUser]);

            expect.assertions(2);

            const users = await User.findAll();

            expect(db.any).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        });

        test('throws a HttpError if unsuccessful', async () => {
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

        test('throws a HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.findById(mockUser.id)).rejects.toThrow(
                new HttpError('Database error'),
            );
        });
    });

    describe('#create', () => {
        test('inserts and returns a new user', async () => {
            db.one = jest.fn().mockResolvedValue(mockUser);

            expect.assertions(2);

            const newUser = await User.create({
                email: mockUser.email,
                username: mockUser.username,
            });

            expect(db.one).toHaveBeenCalled();
            expect(newUser).toEqual(mockUser);
        });

        test('throws a HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.create(mockUser)).rejects.toThrow(new HttpError('Database error'));
        });
    });

    describe('#update', () => {
        const updatedUser = {
            id: mockUser.id,
            email: mockUser.email,
            username: 'updated_user',
        };

        test('updates and returns a user', async () => {
            db.one = jest.fn().mockResolvedValue(updatedUser);

            expect.assertions(2);

            const user = await User.update({
                id: mockUser.id,
                email: mockUser.email,
                username: 'updated_user',
            });

            expect(db.one).toHaveBeenCalled();
            expect(user).toEqual(updatedUser);
        });

        test('throws a HttpError if unsuccessful', async () => {
            db.one = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.update(updatedUser)).rejects.toThrow(new HttpError('Database error'));
        });
    });

    describe('#destroy', () => {
        test('deletes the correct user', async () => {
            db.none = jest.fn();

            expect.assertions(1);

            await User.destroy(mockUser.id);

            expect(db.none).toHaveBeenCalled();
        });

        test('throws a HttpError if unsuccessful', async () => {
            db.none = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.destroy(mockUser.id)).rejects.toThrow(
                new HttpError('Database error'),
            );
        });
    });
});
