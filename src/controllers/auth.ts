import { Request, Response, NextFunction } from 'express';
import { compact, isEmpty, pick } from 'lodash';
import { HttpError } from '../helpers/errors';
import User from '../models/User';

export const SignupErrors = {
    missingCredential: new HttpError('You must provide an email, username, and password', 400),
    accountExists: new HttpError('An account for this email or username already exists', 400),
};

export interface SignupCredentials {
    email: string;
    username: string;
    password: string;
}

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const credentials: SignupCredentials = pick(req.body, ['email', 'username', 'password']);
        validateCredentials(credentials);
        await checkForExistingUsers(credentials);

        const user = await User.create(credentials);

        return req.login(user, err => {
            if (err) {
                throw new HttpError(err);
            }

            return res.send({ isAuthenticated: !!req.user });
        });
    } catch (err) {
        next(err);
    }
}

function validateCredentials({ email, username, password }: SignupCredentials): void {
    if (!email || !username || !password) {
        throw SignupErrors.missingCredential;
    }
}

async function checkForExistingUsers({ email, username }: SignupCredentials): Promise<void> {
    const users = await Promise.all([User.findOne({ email }), User.findOne({ username })]);

    if (!isEmpty(compact(users))) {
        throw SignupErrors.accountExists;
    }
}
