import { HttpError } from '../../helpers/errors';
import { db } from '../../db';
import sql from './sql';

interface UserProfile {
    id?: number;
    email: string;
    username: string;
}

export default class User {
    static async findAll() {
        try {
            const users = await db.any(sql.findAll);
            return users;
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async findById(id: number) {
        try {
            const user = await db.one(sql.findById, id);
            return user;
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async create(data: UserProfile) {
        try {
            const user = await db.one(sql.create, data);
            return user;
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async update(data: UserProfile) {
        try {
            const user = await db.one(sql.update, data);
            return user;
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async destroy(id: number) {
        try {
            await db.none(sql.destroy, id);
        } catch (err) {
            throw new HttpError(err);
        }
    }
}
