import { v4 as uuidv4 } from 'uuid';
import db from '@db';
import { hash, makeUser } from '@helpers/user';
import { HttpError } from '@utils/errors';
import { SignupRequest, User, UserEntity, PaginationOptions } from '@types';

interface UserUpdateParams {
    requestor: User;
    data: Partial<UserEntity> & { id: string };
}

interface UserDeleteParams {
    requestor: User;
    data: {
        id: string;
    };
}

export async function fetchUsers(paginationOptions: PaginationOptions): Promise<User[]> {
    try {
        const userEntities = await db.users.findAll(paginationOptions);
        return userEntities.map(makeUser);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function fetchUser(id: string): Promise<User> {
    try {
        const userEntity = await db.users.findById(id);
        return makeUser(userEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function createUser(signupRequestData: SignupRequest): Promise<User> {
    try {
        const hashedPassword = hash(signupRequestData.password);

        const userEntity = await db.users.create({
            id: uuidv4(),
            ...signupRequestData,
            password: hashedPassword,
            role: 'user',
        });

        return makeUser(userEntity);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function updateUser({ requestor, data }: UserUpdateParams): Promise<User> {
    try {
        const userEntity = await db.users.findById(data.id);

        if (requestor.role !== 'admin' && requestor.id !== userEntity.id) {
            throw new HttpError('User ID does not match resource', 403);
        }

        const password = data.password ? hash(data.password) : userEntity.password;
        const updatedUserEntity = { ...userEntity, ...data, password };

        await db.users.update(updatedUserEntity);

        return makeUser(updatedUserEntity);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(err, 404);
    }
}

export async function deleteUser({
    requestor,
    data: { id: userId },
}: UserDeleteParams): Promise<void> {
    try {
        if (requestor.role !== 'admin') {
            const userEntity = await db.users.findById(userId);

            if (requestor.id !== userEntity.id) {
                throw new HttpError('User ID does not match resource', 403);
            }
        }

        await db.users.destroy(userId);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(err);
    }
}
