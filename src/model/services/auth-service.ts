import { compact, isEmpty } from 'lodash';
import { HttpError } from '../../helpers/errors';
import { SignupCredentials, SignupResponse, UserEntity } from '../../types';
import { db } from '../db';
import User from '../User';
import * as userService from './user-service';

export const USER_EXISTS_MESSAGE = 'An account for this email or username already exists';

export async function signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
        const message: string | void = await checkForExistingUsers(credentials);

        if (message) {
            return { message };
        }

        const user: User = await userService.createUser(credentials);
        return { user };
    } catch (err) {
        throw new HttpError(err);
    }
}

async function checkForExistingUsers({
    email,
    username,
}: SignupCredentials): Promise<void | string> {
    const userEntities: (UserEntity | null)[] = await Promise.all([
        db.users.findOne({ email }),
        db.users.findOne({ username }),
    ]);

    if (!isEmpty(compact(userEntities))) {
        return USER_EXISTS_MESSAGE;
    }
}
