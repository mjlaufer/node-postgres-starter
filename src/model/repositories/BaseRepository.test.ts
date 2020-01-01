import pgPromise from 'pg-promise';
import { db } from './db';
import BaseRepository from './BaseRepository';

jest.mock('./db', () => ({
    db: {
        any: jest.fn(),
        none: jest.fn(),
        one: jest.fn(),
    },
    pgp: pgPromise(),
}));

interface MockEntity {
    id: number;
    foo: string;
    bar: string;
}

describe('BaseRepository', () => {
    const mockData = {
        foo: 'foo',
        bar: 'bar',
    };

    const mockEntity: MockEntity = {
        id: 1,
        foo: 'foo',
        bar: 'bar',
    };

    class MockRepository extends BaseRepository<MockEntity> {}

    const Repository = new MockRepository('mockTableName');

    describe('#findAll', () => {
        test('returns a list of all entities', async () => {
            db.any = jest.fn().mockResolvedValue([mockEntity]);

            expect.assertions(2);

            const entities: MockEntity[] = await Repository.findAll();

            expect(db.any).toHaveBeenCalled();
            expect(entities).toEqual([mockEntity]);
        });
    });

    describe('#findById', () => {
        test('returns the correct entity', async () => {
            db.one = jest.fn().mockResolvedValue(mockEntity);

            expect.assertions(2);

            const entity: MockEntity = await Repository.findById(mockEntity.id);

            expect(db.one).toHaveBeenCalled();
            expect(entity).toEqual(mockEntity);
        });
    });

    describe('#create', () => {
        test('inserts and returns a new entity', async () => {
            db.one = jest.fn().mockResolvedValue(mockEntity);

            expect.assertions(2);

            const newEntity: MockEntity = await Repository.create(mockData);

            expect(db.one).toHaveBeenCalled();
            expect(newEntity).toEqual(mockEntity);
        });
    });

    describe('#update', () => {
        const updatedEntity = {
            ...mockEntity,
            foo: 'foo_updated',
        };

        test('updates and returns an entity', async () => {
            db.one = jest.fn().mockResolvedValue(updatedEntity);

            expect.assertions(2);

            const entity: MockEntity = await Repository.update({
                ...mockEntity,
                foo: 'foo_updated',
            });

            expect(db.one).toHaveBeenCalled();
            expect(entity).toEqual(updatedEntity);
        });
    });

    describe('#destroy', () => {
        test('deletes the correct record', async () => {
            db.none = jest.fn();

            expect.assertions(1);

            await Repository.destroy(mockEntity.id);

            expect(db.none).toHaveBeenCalled();
        });
    });
});
