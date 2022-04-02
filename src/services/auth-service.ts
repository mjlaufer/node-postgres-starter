import { toString } from 'lodash';
import { HttpError } from '@utils/errors';
import db from '@db';
import { SignupRequest, SignupResponse, User, UserEntity } from '@types';
import * as userService from './user-service';

export const USER_EXISTS_MESSAGE = 'An account for this email already exists';

export async function signup(signupRequestData: SignupRequest): Promise<SignupResponse> {
    try {
        const message: string | void = await checkForExistingUsers(signupRequestData.email);

        if (message) {
            return { message };
        }

        const user: User = await userService.createUser(signupRequestData);
        return { user };
    } catch (err) {
        const message = err instanceof Error ? err.message : toString(err);
        throw new HttpError(message);
    }
}

async function checkForExistingUsers(email: string): Promise<void | string> {
    const userEntity: UserEntity | null = await db.users.findOne({ email });

    if (userEntity) {
        return USER_EXISTS_MESSAGE;
    }
}
