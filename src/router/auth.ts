import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth-controller';
import { signupSchema, loginSchema } from '../helpers/schemas';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeSignupCredentials, sanitizeLoginCredentials } from '../middleware/sanitize';
import validateSchema from '../middleware/validateSchema';

const router = express.Router();

router.route('/current-user').get((req, res) => {
    res.json(req.user);
});

router
    .route('/signup')
    .post(
        sanitizeSignupCredentials,
        validateSchema(signupSchema),
        asyncWrapper(authController.signup),
    );

router
    .route('/login')
    .post(
        sanitizeLoginCredentials,
        validateSchema(loginSchema),
        passport.authenticate('local'),
        (req, res) => {
            res.json({ isAuthenticated: !!req.user });
        },
    );

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;
