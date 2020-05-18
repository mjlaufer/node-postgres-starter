import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../../helpers/errors';
import { SignupRequest, UserEntity, UserUpdateRequest, PaginationOptions } from '../../types';
import { db } from '../db';
import User from '../User';

export async function fetchUsers(paginationOptions: PaginationOptions): Promise<User[]> {
    try {
        const userEntities: UserEntity[] = await db.users.findAll(paginationOptions);
        return userEntities.map((userEntity: UserEntity) => new User(userEntity));
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function fetchUser(id: string): Promise<User> {
    try {
        const userEntity: UserEntity = await db.users.findById(id);
        return new User(userEntity);
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

        return new User(userEntity);
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

        return new User(updatedUserEntity);
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

function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}
