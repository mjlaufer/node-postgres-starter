import express from 'express';
import passport from 'passport';
import AuthController from '../../controllers/AuthController';
import asyncWrapper from '../middleware/asyncWrapper';
import schemaValidator from '../middleware/schemaValidator';

const router = express.Router();

router.route('/current-user').get((req, res) => {
    res.send(req.user);
});

router.route('/signup').post(schemaValidator, asyncWrapper(AuthController.signup));

router.route('/login').post(schemaValidator, passport.authenticate('local'), (req, res) => {
    res.send({ isAuthenticated: !!req.user });
});

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;
