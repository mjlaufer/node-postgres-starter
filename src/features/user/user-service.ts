import { toString } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import db from '@db';
import { hash, makeUser } from '@features/user/user-helpers';
import { HttpError, InternalServerError, ForbiddenError, NotFoundError } from '@errors';
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

function handleError(err: unknown): never {
    if (err instanceof HttpError) {
        throw err;
    }
    const message = err instanceof Error ? err.message : toString(err);
    throw new InternalServerError(message);
}

export async function fetchUsers(paginationOptions: PaginationOptions): Promise<User[]> {
    try {
        const userEntities = await db.users.findAll(paginationOptions);
        return userEntities.map(makeUser);
    } catch (err) {
        handleError(err);
    }
}

export async function fetchUser(id: string): Promise<User> {
    try {
        const userEntity = await db.users.findById(id);
        if (!userEntity) {
            throw new NotFoundError(`Could not find user with ID ${id}`);
        }
        return makeUser(userEntity);
    } catch (err) {
        handleError(err);
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
        handleError(err);
    }
}

export async function updateUser({ requestor, data }: UserUpdateParams): Promise<User> {
    try {
        const userEntity = await db.users.findById(data.id);
        if (!userEntity) {
            throw new NotFoundError(`Could not find user with ID ${data.id}`);
        }
        if (requestor.role !== 'admin' && requestor.id !== userEntity.id) {
            throw new ForbiddenError('User ID does not match resource');
        }

        const password = data.password ? hash(data.password) : userEntity.password;
        const updatedUserEntity = { ...userEntity, ...data, password };
        await db.users.update(updatedUserEntity);
        return makeUser(updatedUserEntity);
    } catch (err) {
        handleError(err);
    }
}

export async function deleteUser({
    requestor,
    data: { id: userId },
}: UserDeleteParams): Promise<void> {
    try {
        if (requestor.role !== 'admin') {
            const userEntity = await db.users.findById(userId);
            if (!userEntity) {
                throw new NotFoundError(`Could not find user with ID ${userId}`);
            }
            if (requestor.id !== userEntity.id) {
                throw new ForbiddenError('User ID does not match resource');
            }
        }
        await db.users.destroy(userId);
    } catch (err) {
        handleError(err);
    }
}
