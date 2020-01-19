import { PostEntity } from '../types';

export default class Post {
    id?: string;
    title: string;
    body: string;
    author?: string;

    constructor(postEntity: PostEntity) {
        this.id = postEntity.id;
        this.title = postEntity.title;
        this.body = postEntity.body;
        this.author = postEntity.username;
    }
}
