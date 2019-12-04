import { QueryFile, IQueryFileOptions } from 'pg-promise';

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
