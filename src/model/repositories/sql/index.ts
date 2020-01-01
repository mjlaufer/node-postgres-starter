import path from 'path';
import { generateSqlQuery } from '../db-utils';

const sql = {
    findAll: generateSqlQuery(path.join(__dirname, 'findAll.sql')),
    findById: generateSqlQuery(path.join(__dirname, 'findById.sql')),
    findOne: generateSqlQuery(path.join(__dirname, 'findOne.sql')),
    create: generateSqlQuery(path.join(__dirname, 'create.sql')),
    update: generateSqlQuery(path.join(__dirname, 'update.sql')),
    destroy: generateSqlQuery(path.join(__dirname, 'destroy.sql')),
};

export default sql;
