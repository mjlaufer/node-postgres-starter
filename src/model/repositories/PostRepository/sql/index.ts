import path from 'path';
import { generateSqlQuery } from '../../../utils';

const sql = {
    create: generateSqlQuery(path.join(__dirname, 'create.sql')),
};

export default sql;
