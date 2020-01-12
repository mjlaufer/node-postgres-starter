import bcrypt from 'bcryptjs';
import { HttpError } from '../../helpers/errors';
import { SignupCredentials, UserEntity, UserData } from '../../types';
import { db } from '../db';
import User from '../User';

export async function fetchUsers(): Promise<User[]> {
    try {
        const userEntities: UserEntity[] = await db.users.findAll();
        return userEntities.map((userEntity: UserEntity) => new User(userEntity));
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function fetchUser(id: number): Promise<User> {
    try {
        const userEntity: UserEntity = await db.users.findById(id);
        return new User(userEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function createUser(credentials: SignupCredentials): Promise<User> {
    try {
        const password = hash(credentials.password);

        const userEntity: UserEntity = await db.users.create({
            ...credentials,
            password,
        });

        return new User(userEntity);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function updateUser(userData: UserData): Promise<User> {
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

export async function deleteUser(id: number): Promise<void> {
    try {
        await db.users.destroy(id);
    } catch (err) {
        throw new HttpError(err);
    }
}

function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}
