import express from 'express';
import passport from 'passport';
import * as authController from '../../controllers/auth-controller';
import asyncWrapper from '../middleware/asyncWrapper';
import schemaValidator from '../middleware/schemaValidator';

const router = express.Router();

router.route('/current-user').get((req, res) => {
    res.json(req.user);
});

router.route('/signup').post(schemaValidator, asyncWrapper(authController.signup));

router.route('/login').post(schemaValidator, passport.authenticate('local'), (req, res) => {
    res.json({ isAuthenticated: !!req.user });
});

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;
