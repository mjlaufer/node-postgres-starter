import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';
import { root, auth, users } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';
import createSessionMiddleware from './middleware/session';
import configurePassport from './configurePassport';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));

app.use(createSessionMiddleware());

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', root);
app.use('/', auth);
app.use('/users', users);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
