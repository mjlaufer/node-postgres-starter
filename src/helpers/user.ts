import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import { User, UserEntity } from '@types';

export function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function makeUser(data: UserEntity): User {
    return pick(data, ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt']);
}
