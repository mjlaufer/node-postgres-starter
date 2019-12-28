import { IDatabase } from 'pg-promise';
import { LoginCredentials, SignupCredentials, UserEntity } from '../../types';
import { generateWhereClause } from './sql/helpers';
import { users as sql } from './sql';

export default class UserRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(): Promise<UserEntity[]> {
        const users = await this.db.any<UserEntity>(sql.findAll);
        return users;
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await this.db.one<UserEntity>(sql.findById, { id });
        return user;
    }

    async findOne(credentials: LoginCredentials): Promise<UserEntity | null> {
        const user = await this.db.oneOrNone<UserEntity>(sql.findOne, {
            where: generateWhereClause(credentials),
        });
        return user;
    }

    async create(credentials: SignupCredentials): Promise<UserEntity> {
        const newUser = await this.db.one<UserEntity>(sql.create, credentials);
        return newUser;
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const updatedUser = await this.db.one<UserEntity>(sql.update, { ...userEntity });
        return updatedUser;
    }

    async destroy(id: number): Promise<void> {
        await this.db.none(sql.destroy, { id });
    }
}
