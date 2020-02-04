import { UserEntity } from '../types';

export default class User {
    id?: string;
    email: string;
    username: string;
    createdAt: Date;

    constructor(userEntity: UserEntity) {
        this.id = userEntity.id;
        this.email = userEntity.email;
        this.username = userEntity.username;
        this.createdAt = userEntity.createdAt;
    }
}
