import { UserEntity } from '../types';

export default class User {
    id?: number;
    email: string;
    username: string;

    constructor(userEntity: UserEntity) {
        this.id = userEntity.id;
        this.email = userEntity.email;
        this.username = userEntity.username;
    }
}
