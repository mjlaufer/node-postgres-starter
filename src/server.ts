import { Server as HttpServer } from 'http';
import util from 'util';
import express from 'express';
import helmet from 'helmet';
import { merge } from 'lodash';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import * as router from '@router';
import { errorHandler, notFoundHandler } from '@middleware/errorHandlers';
import createSessionMiddleware from '@middleware/session';
import configurePassport from './configurePassport';

export type Server = Omit<HttpServer, 'close'> & { close: () => Promise<void> };

export async function startServer({ port = process.env.PORT } = {}): Promise<Server> {
    const app = express();

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));
    }

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

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`> server listening on port ${port}`);
            const close = util.promisify(server.close);
            resolve(merge(server, { close }));
        });
    });
}
