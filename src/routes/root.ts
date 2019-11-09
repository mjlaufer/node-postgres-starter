import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.send({
        jsonapi: {
            version: '1.0',
        },
        links: {
            self: `${req.get('host')}${req.url}`,
        },
        meta: {
            authors: ['Matthew Laufer'],
            copyright: 'Copyright 2019 Matthew Laufer.',
        },
    });
});

export default router;
