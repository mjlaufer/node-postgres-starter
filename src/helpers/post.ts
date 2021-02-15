import { pick } from 'lodash';
import { Post, PostEntity } from '@types';

export function makePost(data: PostEntity): Post {
    return {
        ...pick(data, ['id', 'title', 'body', 'createdAt', 'modifiedAt']),
        author: data.username,
    };
}
