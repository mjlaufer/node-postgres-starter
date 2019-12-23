import { Request, Response } from 'express';
import AuthService from '../model/services/auth';
import { User } from '../model/services/user';
import { SignupCredentials } from '../types';
import AuthController from './auth';

jest.mock('../model/services/auth');

describe('AuthController', () => {
    const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
    };
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        req.login = jest.fn();
        res.send = jest.fn();
    });

    describe('#signup', () => {
        const signupCredentials: SignupCredentials = {
            email: 'test@test.com',
            username: 'username',
            password: 'password',
        };

        test('authenticates a new user if AuthService.signup returns a user', async () => {
            AuthService.signup = jest.fn().mockResolvedValue({ user: mockUser });
            req.body = signupCredentials;

            expect.assertions(2);

            await AuthController.signup(req, res);

            expect(AuthService.signup).toHaveBeenCalledWith(signupCredentials);
            expect(req.login).toHaveBeenCalled();
        });

        test('sends a message if AuthService.signup returns a message', async () => {
            AuthService.signup = jest.fn().mockResolvedValue({ message: 'message' });
            req.body = signupCredentials;

            expect.assertions(3);

            await AuthController.signup(req, res);

            expect(AuthService.signup).toHaveBeenCalledWith(signupCredentials);
            expect(req.login).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ isAuthenticated: false, message: 'message' });
        });
    });
});
