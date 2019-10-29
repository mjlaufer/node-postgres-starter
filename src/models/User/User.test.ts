import { db } from '../../db';
import { CustomError } from '../../middleware/errors';
import User from './index';

jest.mock('../../db', () => ({
    db: {
        any: jest.fn(),
        oneOrNone: jest.fn(),
    },
}));

describe('User model', () => {
    const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
    };

    describe('#findAll', () => {
        test('returns a list of all users', async () => {
            db.any = jest.fn().mockResolvedValue([user]);

            expect.assertions(2);

            const users = await User.findAll();

            expect(db.any).toHaveBeenCalled();
            expect(users).toEqual([user]);
        });

        test('throws a CustomError if unsuccessful', async () => {
            db.any = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.findAll()).rejects.toThrow(new CustomError('Database error'));
        });
    });

    describe('#create', () => {
        test('inserts and returns a new user', async () => {
            db.oneOrNone = jest.fn().mockResolvedValue(user);

            expect.assertions(2);

            const newUser = await User.create({
                email: 'test@test.com',
                username: 'test_user',
            });

            expect(db.oneOrNone).toHaveBeenCalled();
            expect(newUser).toEqual(user);
        });

        test('throws a CustomError if unsuccessful', async () => {
            db.oneOrNone = jest.fn().mockRejectedValue('Database error');

            expect.assertions(1);

            await expect(User.create(user)).rejects.toThrow(new CustomError('Database error'));
        });
    });
});
