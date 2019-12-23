import bcrypt from 'bcryptjs';
import { HttpError } from '../../errors';
import { SignupCredentials, UserData } from '../../types';
import UserRepository, { UserEntity } from '../repositories/user';

export class User {
    id?: number;
    email: string;
    username: string;

    constructor(userEntity: UserEntity) {
        this.id = userEntity.id;
        this.email = userEntity.email;
        this.username = userEntity.username;
    }
}

export default class UserService {
    static async findAllUsers(): Promise<User[]> {
        try {
            const userEntities: UserEntity[] = await UserRepository.findAll();
            return userEntities.map((userEntity: UserEntity) => new User(userEntity));
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async findUser(id: number): Promise<User> {
        try {
            const userEntity: UserEntity = await UserRepository.findById(id);
            return new User(userEntity);
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async createUser(credentials: SignupCredentials): Promise<User> {
        try {
            const password = hash(credentials.password);

            const userEntity: UserEntity = await UserRepository.create({
                ...credentials,
                password,
            });

            return new User(userEntity);
        } catch (err) {
            throw new HttpError(err);
        }
    }

    static async updateUser(userData: UserData): Promise<User> {
        try {
            const userEntity: UserEntity = await UserRepository.findById(userData.id);

            const password = userData.password ? hash(userData.password) : userEntity.password;

            const updatedUserEntity: UserEntity = { ...userEntity, ...userData, password };

            await UserRepository.update(userEntity);

            return new User(updatedUserEntity);
        } catch (err) {
            throw new HttpError(err, 404);
        }
    }

    static async deleteUser(id: number): Promise<void> {
        try {
            await UserRepository.destroy(id);
        } catch (err) {
            throw new HttpError(err);
        }
    }
}

function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}
