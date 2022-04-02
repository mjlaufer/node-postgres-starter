import { Request, Response } from 'express';
import { pick } from 'lodash';
import { HttpError } from '@errors';
import * as authService from '@features/auth/auth-service';
import { SignupRequest } from '@types';

export async function signup(req: Request, res: Response): Promise<void> {
    const signupRequestData: SignupRequest = pick(req.body, ['email', 'username', 'password']);

    const { message, user } = await authService.signup(signupRequestData);

    if (user) {
        return req.login(user, (err) => {
            if (err) {
                throw new HttpError(err);
            }

            return res.json({ isAuthenticated: true });
        });
    }

    res.json({ isAuthenticated: false, message });
}
