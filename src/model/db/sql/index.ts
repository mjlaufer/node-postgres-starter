import { QueryFile, IQueryFileOptions } from 'pg-promise';
import path from 'path';
import { partial } from 'lodash';

const getPath = partial(path.join, __dirname);

export const users = {
    findAll: generateSqlQuery(getPath('users/findAll.sql')),
    findById: generateSqlQuery(getPath('users/findById.sql')),
    findOne: generateSqlQuery(getPath('users/findOne.sql')),
    create: generateSqlQuery(getPath('users/create.sql')),
    update: generateSqlQuery(getPath('users/update.sql')),
    destroy: generateSqlQuery(getPath('users/destroy.sql')),
};

export const posts = {
    findAll: generateSqlQuery(getPath('posts/findAll.sql')),
};

function generateSqlQuery(path: string): QueryFile {
    const options: IQueryFileOptions = {
        minify: true,
    };

    return new QueryFile(path, options);
}
