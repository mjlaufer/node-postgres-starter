import bcrypt from 'bcryptjs';
import { HttpError } from '../../helpers/errors';
import { db } from '../../db';
import sql from './sql';

export interface UserIdentity {
    id?: number;
    email: string;
    username: string;
    password: string;
}

export interface Login {
    [key: string]: string | undefined;
    email?: string;
    username?: string;
}

export default class User {
    static async findAll(): Promise<UserIdentity[]> {
        try {
            const users = await db.any(sql.findAll);
            return users;
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async findById(id: number): Promise<UserIdentity> {
        try {
            const user = await db.one(sql.findById, id);
            return user;
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async findOne(login: Login): Promise<UserIdentity> {
        let query = 'SELECT * FROM users ';
        const columns: string[] = [];
        const values: any[] = [];

        Object.keys(login).forEach((key, i) => {
            columns.push(`WHERE ${key} = $${i + 1}`);
            values.push(login[key]);
        });

        const where = columns.join(' AND ');

        query += where;

        try {
            const user = await db.oneOrNone(query, values);
            return user;
        } catch (err) {
            throw new HttpError(err, 400);
        }
    }

    static async create(userIdentity: UserIdentity): Promise<UserIdentity> {
        try {
            const password = bcrypt.hashSync(userIdentity.password, 10);

            const user = await db.one(sql.create, { ...userIdentity, password });

            return user;
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async update(userIdentity: UserIdentity): Promise<UserIdentity> {
        try {
            const user = await db.one(sql.update, userIdentity);
            return user;
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async destroy(id: number): Promise<void> {
        try {
            await db.none(sql.destroy, id);
        } catch (err) {
            throw new HttpError(err);
        }
    }
}
