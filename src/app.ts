import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import * as router from './router';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';
import createSessionMiddleware from './middleware/session';
import configurePassport from './configurePassport';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));

app.use(createSessionMiddleware());

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router.root);
app.use('/', router.auth);
app.use('/users', router.users);
app.use('/posts', router.posts);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
