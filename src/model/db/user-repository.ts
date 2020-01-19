import { IDatabase } from 'pg-promise';
import { LoginCredentials, SignupCredentials, UserEntity } from '../../types';
import { generateWhereClause } from './helpers';

interface SignupCredentialsWithId extends SignupCredentials {
    id: string;
}

export default class UserRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(): Promise<UserEntity[]> {
        const users = await this.db.any<UserEntity>('SELECT * FROM users');
        return users;
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.db.one<UserEntity>('SELECT * FROM users WHERE id = $1', id);
        return user;
    }

    async findOne(credentials: LoginCredentials): Promise<UserEntity | null> {
        const user = await this.db.oneOrNone<UserEntity>(
            'SELECT * FROM users $1:raw',
            generateWhereClause(credentials),
        );
        return user;
    }

    async create(credentials: SignupCredentialsWithId): Promise<UserEntity> {
        const newUser = await this.db.one<UserEntity>(
            'INSERT INTO users(id, email, username, password) VALUES(${id}, ${email}, ${username}, ${password}) RETURNING *',
            credentials,
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
