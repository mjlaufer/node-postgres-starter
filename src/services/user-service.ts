import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import db from '@db';
import { HttpError } from '@utils/errors';
import { SignupRequest, User, UserEntity, UserUpdateRequest, PaginationOptions } from '@types';

function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function makeUser(data: UserEntity): User {
    return pick(data, ['id', 'email', 'username', 'createdAt']);
}

export async function fetchUsers(paginationOptions: PaginationOptions): Promise<User[]> {
    try {
        const userEntities: UserEntity[] = await db.users.findAll(paginationOptions);
        return userEntities.map(makeUser);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function fetchUser(id: string): Promise<User> {
    try {
        const userEntity: UserEntity = await db.users.findById(id);
        return makeUser(userEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function createUser(signupRequestData: SignupRequest): Promise<User> {
    try {
        const password = hash(signupRequestData.password);

        const userEntity: UserEntity = await db.users.create({
            id: uuidv4(),
            ...signupRequestData,
            password,
        });

        return makeUser(userEntity);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function updateUser(userData: UserUpdateRequest): Promise<User> {
    try {
        const userEntity: UserEntity = await db.users.findById(userData.id);
        const password = userData.password ? hash(userData.password) : userEntity.password;
        const updatedUserEntity: UserEntity = { ...userEntity, ...userData, password };

        await db.users.update(updatedUserEntity);

        return makeUser(updatedUserEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function deleteUser(id: string): Promise<void> {
    try {
        await db.users.destroy(id);
    } catch (err) {
        throw new HttpError(err);
    }
}
