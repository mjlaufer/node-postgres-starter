import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.send({
        version: '1.0',
        authors: ['Matthew Laufer'],
        copyright: 'Copyright 2019 Matthew Laufer.',
    });
});

export default router;
