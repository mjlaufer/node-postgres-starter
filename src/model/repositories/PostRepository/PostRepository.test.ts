import PostRepository from './index';

describe('PostRepository', () => {
    test('is an instance of class PostRepository', () => {
        expect(PostRepository).toEqual({ tableName: 'posts' });
    });
});
