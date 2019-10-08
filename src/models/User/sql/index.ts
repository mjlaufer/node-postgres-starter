import { generateSqlQuery } from '../../utils';

const sql = {
    findAll: generateSqlQuery(__dirname, 'findAll.sql'),
    create: generateSqlQuery(__dirname, 'create.sql'),
};

export default sql;
