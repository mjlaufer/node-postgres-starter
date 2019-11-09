import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth';

const router = express.Router();

router.route('/current-user').get((req, res) => {
    res.send(req.user);
});

router.route('/signup').post(authController.signup);

router.route('/login').post(passport.authenticate('local'), (req, res) => {
    res.send({ isAuthenticated: !!req.user });
});

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;
