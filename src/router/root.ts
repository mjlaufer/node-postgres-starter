import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.json({
        version: '1.0.0',
        authors: ['Matthew Laufer'],
        copyright: 'Copyright 2021 Matthew Laufer.',
    });
});

export default router;
