import { CustomError } from '../../middleware/errors';
import { db } from '../../db';
import sql from './sql';

interface UserProfile {
    id: number;
    email: string;
}

export default class User {
    static async findAll() {
        try {
            const users = await db.any(sql.findAll);
            return users;
        } catch (err) {
            throw new CustomError(err);
        }
    }

    static async create(data: UserProfile) {
        try {
            const user = await db.oneOrNone(sql.create, data);
            return user;
        } catch (err) {
            throw new CustomError(err);
        }
    }
}
