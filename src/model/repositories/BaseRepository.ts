import { db } from './db';
import sql from './sql';

export default abstract class Repository<T> {
    constructor(public tableName: string) {}

    async findAll(): Promise<T[]> {
        const entities: T[] = await db.any(sql.findAll, this.tableName);
        return entities;
    }

    async findById(id: number): Promise<T> {
        const entity: T = await db.one(sql.findById, { table: this.tableName, id });
        return entity;
    }

    async create(data: object): Promise<T> {
        const entity: T = await db.one(sql.create, {
            table: this.tableName,
            ...data,
        });

        return entity;
    }

    async update(data: T): Promise<T> {
        const entity: T = await db.one(sql.update, { table: this.tableName, ...data });
        return entity;
    }

    async destroy(id: number): Promise<void> {
        await db.none(sql.destroy, { table: this.tableName, id });
    }
}
