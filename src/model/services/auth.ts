import { compact, isEmpty } from 'lodash';
import { HttpError } from '../../errors';
import { SignupCredentials } from '../../types';
import UserRepository, { UserEntity } from '../repositories/UserRepository';
import UserService, { User } from '../services/user';

export const USER_EXISTS_MESSAGE = 'An account for this email or username already exists';

export interface SignupResponse {
    message?: string;
    user?: User;
}

export default class AuthService {
    static async signup(credentials: SignupCredentials): Promise<SignupResponse> {
        try {
            const message: string | void = await checkForExistingUsers(credentials);

            if (message) {
                return { message };
            }

            const user: User = await UserService.createUser(credentials);
            return { user };
        } catch (err) {
            throw new HttpError(err);
        }
    }
}

async function checkForExistingUsers({
    email,
    username,
}: SignupCredentials): Promise<void | string> {
    const userEntities: (UserEntity | null)[] = await Promise.all([
        UserRepository.findOne({ email }),
        UserRepository.findOne({ username }),
    ]);

    if (!isEmpty(compact(userEntities))) {
        return USER_EXISTS_MESSAGE;
    }
}
