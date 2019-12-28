import { LoginCredentials, SignupCredentials } from '../../../types';
import { db } from '../../db';
import { generateWhereClause } from '../../utils';
import sql from './sql';

export interface UserEntity {
    id: number;
    email: string;
    username: string;
    password: string;
}

export default class UserRepository {
    static async findAll(): Promise<UserEntity[]> {
        const users: UserEntity[] = await db.any(sql.findAll);
        return users;
    }

    static async findById(id: number): Promise<UserEntity> {
        const user: UserEntity = await db.one(sql.findById, id);
        return user;
    }

    static async findOne(credentials: LoginCredentials): Promise<UserEntity | null> {
        const user: UserEntity | null = await db.oneOrNone(
            sql.findOne,
            generateWhereClause(credentials),
        );
        return user;
    }

    static async create(credentials: SignupCredentials): Promise<UserEntity> {
        const user: UserEntity = await db.one(sql.create, credentials);
        return user;
    }

    static async update(userEntity: UserEntity): Promise<UserEntity> {
        const user: UserEntity = await db.one(sql.update, userEntity);
        return user;
    }

    static async destroy(id: number): Promise<void> {
        await db.none(sql.destroy, id);
    }
}
