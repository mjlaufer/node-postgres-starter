import { QueryFile, IQueryFileOptions } from 'pg-promise';
import { pgp } from './db';

export function generateSqlQuery(path: string): QueryFile {
    const options: IQueryFileOptions = {
        minify: true,
    };

    const qf = new QueryFile(path, options);

    if (qf.error) {
        console.error(qf.error);
    }

    return qf;
}

export function generateWhereClause(params: { [key: string]: any }): string {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.keys(params).forEach((key, i) => {
        conditions.push(`WHERE ${key} = $${i + 1}`);
        values.push(params[key]);
    });

    const where = conditions.join(' AND ');

    return pgp.as.format(where, values);
}
