import { QueryFile, IQueryFileOptions } from 'pg-promise';
import path from 'path';

export function generateSqlQuery(dirname: string, file: string): QueryFile {
    const destination: string = path.join(dirname, file);

    const options: IQueryFileOptions = {
        minify: true,
    };

    const qf = new QueryFile(destination, options);

    if (qf.error) {
        console.error(qf.error);
    }

    return qf;
}
