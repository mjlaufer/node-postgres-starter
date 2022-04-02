import { Server as HttpServer } from 'http';
import util from 'util';
import express, { RequestHandler } from 'express';
import { json } from 'body-parser';
import helmet from 'helmet';
import { merge } from 'lodash';
import morgan from 'morgan';
import passport from 'passport';
import authRouter from '@features/auth/auth-router';
import userRouter from '@features/user/user-router';
import postRouter from '@features/post/post-router';
import { errorHandler, notFoundHandler } from '@middleware/errorHandlers';
import createSessionMiddleware from '@middleware/session';
import configurePassport from './configurePassport';

export type Server = Omit<HttpServer, 'close'> & { close: () => Promise<void> };

export async function startServer({ port = process.env.PORT } = {}): Promise<Server> {
    const app = express();

    app.use(helmet());
    app.use(json());

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));
    }

    app.use(createSessionMiddleware() as RequestHandler);

    configurePassport(passport);
    app.use(passport.initialize() as RequestHandler);
    app.use(passport.session());

    app.get('/', (req, res) => {
        res.json({
            version: '1.0.0',
            copyright: 'Copyright 2022 Matthew Laufer.',
        });
    });
    app.use('/', authRouter);
    app.use('/users', userRouter);
    app.use('/posts', postRouter);

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
