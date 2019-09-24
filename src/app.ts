import express from 'express';
import { errorHandler, notFound } from './middleware/errors';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(notFound);
app.use(errorHandler(app));

export default app;
