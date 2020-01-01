import BaseRepository from '../BaseRepository';

export interface PostEntity {
    id: number;
    title: string;
    body: string;
    user_id: number;
}

class PostRepository extends BaseRepository<PostEntity> {
    constructor() {
        super('posts');
    }
}

export default new PostRepository();
