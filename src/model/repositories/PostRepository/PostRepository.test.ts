import pgPromise from 'pg-promise';
import { PostData } from '../../../types';
import { db } from '../../db';
import PostRepository, { PostEntity } from './index';

jest.mock('../../db', () => ({
    db: {
        one: jest.fn(),
    },
    pgp: pgPromise(),
}));

describe('PostRepository', () => {
    const mockPostData: PostData = {
        title: 'Test Title',
        body: 'Test body',
        userId: 1,
    };

    const mockPostEntity: PostEntity = {
        id: 1,
        title: mockPostData.title,
        body: mockPostData.body,
        user_id: 1,
    };

    describe('#create', () => {
        test('inserts and returns a new post', async () => {
            db.one = jest.fn().mockResolvedValue(mockPostEntity);

            expect.assertions(2);

            const newPostEntity = await PostRepository.create(mockPostData);

            expect(db.one).toHaveBeenCalled();
            expect(newPostEntity).toEqual(mockPostEntity);
        });
    });
});
