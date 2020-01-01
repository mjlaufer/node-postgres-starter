import PostRepository from './PostRepository';

describe('PostRepository', () => {
    test('is an instance of class PostRepository', () => {
        expect(PostRepository).toEqual({ tableName: 'posts' });
    });
});
