import { IDatabase } from 'pg-promise';
import { UserCreateRequest, UserEntity, PaginationOptions } from '@types';
import { generateWhereClause } from './helpers';

export default class UserRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(paginationOptions: PaginationOptions): Promise<UserEntity[]> {
        const users = await this.db.any<UserEntity>(
            'SELECT * FROM users WHERE created_at < ${lastCreatedAt} ORDER BY created_at ${order:raw} LIMIT ${limit}',
            paginationOptions,
        );
        return users;
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.db.one<UserEntity>('SELECT * FROM users WHERE id = $1', id);
        return user;
    }

    async findOne(data: { email: string }): Promise<UserEntity | null> {
        const user = await this.db.oneOrNone<UserEntity>(
            'SELECT * FROM users $1:raw',
            generateWhereClause(data),
        );
        return user;
    }

    async create(data: UserCreateRequest): Promise<UserEntity> {
        const newUser = await this.db.one<UserEntity>(
            'INSERT INTO users(id, email, username, password) VALUES(${id}, ${email}, ${username}, ${password}) RETURNING *',
            data,
        );
        return newUser;
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const updatedUser = await this.db.one<UserEntity>(
            'UPDATE users SET email = ${email}, username = ${username} WHERE id = ${id} RETURNING *',
            userEntity,
        );
        return updatedUser;
    }

    async destroy(id: string): Promise<void> {
        await this.db.none('DELETE FROM users WHERE id = $1', id);
    }
}
