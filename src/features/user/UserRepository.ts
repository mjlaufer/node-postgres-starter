import { IDatabase } from 'pg-promise';
import { UserCreateRequest, UserEntity, PaginationOptions } from '@types';
import { generateWhereClause } from '../../db/helpers';

interface UserRecord extends Omit<UserEntity, 'role'> {
    roleId: number;
}

export default class UserRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(paginationOptions: PaginationOptions): Promise<UserEntity[]> {
        const users = await this.db.any<UserEntity>(
            'SELECT u.id, u.email, u.username, u.password, u.created_at, u.updated_at, r.name as role FROM users u ' +
                'INNER JOIN roles r ON r.id = u.role_id ' +
                'WHERE u.created_at < ${lastCreatedAt} ORDER BY u.created_at ${order:raw} LIMIT ${limit}',
            paginationOptions,
        );
        return users;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.db.oneOrNone<UserEntity>(
            'SELECT u.id, u.email, u.username, u.password, u.created_at, u.updated_at, r.name as role FROM users u ' +
                'INNER JOIN roles r ON r.id = u.role_id ' +
                'WHERE u.id = $1',
            id,
        );
        return user;
    }

    async findOne(data: { email: string }): Promise<UserEntity | null> {
        const user = await this.db.oneOrNone<UserEntity>(
            'SELECT u.id, u.email, u.username, u.password, u.created_at, u.updated_at, r.name as role FROM users u ' +
                'INNER JOIN roles r ON r.id = u.role_id $1:raw',
            generateWhereClause(data),
        );
        return user;
    }

    async create(data: UserCreateRequest): Promise<UserEntity> {
        const { role } = data;

        const { id: roleId } = await this.db.one<{ id: number }>(
            'SELECT id FROM roles WHERE name = $1',
            role,
        );

        const values = await this.db.one<UserRecord>(
            'INSERT INTO users (id, email, username, password, role_id) ' +
                'VALUES (${id}, ${email}, ${username}, ${password}, ${roleId}) ' +
                'RETURNING *',
            { ...data, roleId },
        );

        const { roleId: _, ...rest } = values;
        return { ...rest, role };
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const result = await this.db.one<UserEntity>(
            'UPDATE users SET email = ${email}, username = ${username}, password = ${password} FROM ' +
                '(SELECT id, email, username, password, created_at, updated_at, role_id FROM users WHERE id = ${id} FOR UPDATE) u ' +
                'INNER JOIN roles r ON r.id = u.role_id ' +
                'WHERE users.id = u.id ' +
                'RETURNING users.id, users.email, users.username, users.password, users.created_at, users.updated_at, r.name as role',
            userEntity,
        );
        return result;
    }

    async destroy(id: string): Promise<void> {
        await this.db.none('DELETE FROM users WHERE id = $1', id);
    }
}
