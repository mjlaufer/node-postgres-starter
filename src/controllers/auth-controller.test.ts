import * as authService from '@services/auth-service';
import * as generate from '@test/utils/generate';
import { SignupRequest } from '@types';
import * as authController from './auth-controller';

describe('authController', () => {
    const mockUser = generate.user();
    const signupRequestData: SignupRequest = {
        email: generate.email(),
        username: generate.username(),
        password: generate.password(),
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('signup: success', async () => {
        const signup = jest.spyOn(authService, 'signup').mockResolvedValue({ user: mockUser });

        expect.assertions(2);

        const req = generate.req({ body: signupRequestData, login: jest.fn().mockName('login') });
        const res = generate.res();
        await authController.signup(req, res);

        expect(signup).toHaveBeenCalledWith(signupRequestData);
        expect(req.login).toHaveBeenCalled();
    });

    test('signup: fail', async () => {
        const signup = jest.spyOn(authService, 'signup').mockResolvedValue({ message: 'message' });

        const req = generate.req({ body: signupRequestData, login: jest.fn().mockName('login') });
        const res = generate.res();
        expect.assertions(3);

        await authController.signup(req, res);

        expect(signup).toHaveBeenCalledWith(signupRequestData);
        expect(req.login).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ isAuthenticated: false, message: 'message' });
    });
});
