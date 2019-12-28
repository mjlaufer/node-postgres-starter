import { Request, Response } from 'express';
import User from '../model/User';
import * as authService from '../model/services/auth-service';
import { SignupCredentials } from '../types';
import * as authController from './auth-controller';

describe('authController', () => {
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
        res.json = jest.fn();
    });

    describe('#signup', () => {
        const signupCredentials: SignupCredentials = {
            email: 'test@test.com',
            username: 'username',
            password: 'password',
        };

        test('authenticates a new user if authService.signup returns a user', async () => {
            const signup = jest.spyOn(authService, 'signup').mockResolvedValue({ user: mockUser });
            req.body = signupCredentials;

            expect.assertions(2);

            await authController.signup(req, res);

            expect(signup).toHaveBeenCalledWith(signupCredentials);
            expect(req.login).toHaveBeenCalled();
        });

        test('sends a message if authService.signup returns a message', async () => {
            const signup = jest
                .spyOn(authService, 'signup')
                .mockResolvedValue({ message: 'message' });
            req.body = signupCredentials;

            expect.assertions(3);

            await authController.signup(req, res);

            expect(signup).toHaveBeenCalledWith(signupCredentials);
            expect(req.login).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ isAuthenticated: false, message: 'message' });
        });
    });
});