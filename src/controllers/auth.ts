import { Request, Response } from 'express';
import { pick } from 'lodash';
import { HttpError } from '../errors';
import AuthService, { SignupResponse } from '../model/services/auth';
import { SignupCredentials } from '../types';

export default class AuthController {
    static async signup(req: Request, res: Response): Promise<void> {
        const credentials: SignupCredentials = pick(req.body, ['email', 'username', 'password']);

        const { message, user }: SignupResponse = await AuthService.signup(credentials);

        if (user) {
            return req.login(user, err => {
                if (err) {
                    throw new HttpError(err);
                }

                return res.send({ isAuthenticated: true });
            });
        }

        res.send({ isAuthenticated: false, message });
    }
}
