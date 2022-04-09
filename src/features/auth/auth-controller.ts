import { Request, Response } from 'express';
import { pick } from 'lodash';
import { InternalServerError } from '@errors';
import * as authService from '@features/auth/auth-service';
import asyncWrapper from '@middleware/asyncWrapper';
import { SignupRequest } from '@types';

export const signup = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const signupRequestData: SignupRequest = pick(req.body, ['email', 'username', 'password']);

    const { message, user } = await authService.signup(signupRequestData);

    if (user) {
        return req.login(user, (err) => {
            if (err) {
                throw new InternalServerError(err.message);
            }

            return res.json({ isAuthenticated: true });
        });
    }

    res.json({ isAuthenticated: false, message });
});
