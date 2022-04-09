import pgp from './pgp';

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
