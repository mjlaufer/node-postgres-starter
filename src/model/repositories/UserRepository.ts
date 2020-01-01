import { db } from './db';
import { generateWhereClause } from './db-utils';
import BaseRepository from './BaseRepository';

export interface UserEntity {
    id: number;
    email: string;
    username: string;
    password: string;
}

class UserRepository extends BaseRepository<UserEntity> {
    constructor() {
        super('users');
    }

    async findOne(data: { [key: string]: any }): Promise<UserEntity | null> {
        const entity: UserEntity | null = await db.oneOrNone(
            'SELECT * FROM ${table:name} ${where:raw}',
            {
                table: super.tableName,
                where: generateWhereClause(data),
            },
        );

        return entity;
    }
}

export default new UserRepository();
