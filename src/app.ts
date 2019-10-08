import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import { users } from './routes';
import { errorHandler, notFound } from './middleware/errors';

dotenv.config();

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'common'));

app.use('/users', users);

app.use(notFound);
app.use(errorHandler(app));

export default app;
