import { Request, Response } from 'express';
import { pick } from 'lodash';
import User from '../models/User';
import { signup, SignupCredentials, SignupErrors } from './auth';

jest.mock('../models/User', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('auth controller', () => {
    const mockUser = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
    };
    let req: Request;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        req.login = jest.fn();
        res.send = jest.fn();
    });

    describe('#signup', () => {
        const signupCredentials: SignupCredentials = {
            email: 'test@test.com',
            username: 'test_user',
            password: 'test',
        };

        test('throws error if a signup credential is missing', async () => {
            req.body = pick(signupCredentials, ['email', 'username']);

            expect.assertions(2);

            await signup(req, res, next);

            expect(User.create).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(SignupErrors.missingCredential);
        });

        test('throws error if email or username is already taken', async () => {
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            req.body = signupCredentials;

            expect.assertions(2);

            await signup(req, res, next);

            expect(User.create).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(SignupErrors.accountExists);
        });

        test('creates and authenticates a new user', async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            User.create = jest.fn().mockResolvedValue(mockUser);
            req.body = signupCredentials;

            expect.assertions(2);

            await signup(req, res, next);

            expect(User.create).toHaveBeenCalledWith(signupCredentials);
            expect(req.login).toHaveBeenCalled();
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.create = jest.fn().mockRejectedValue(err);
            req.body = signupCredentials;

            expect.assertions(1);

            await signup(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
