import express, { Request, Response } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth-controller';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeEmail, sanitizeText } from '../middleware/sanitizers';
import { validateLoginCredentials, validateSignupCredentials } from '../middleware/validators';

const router = express.Router();

router.route('/current-user').get((req: Request, res: Response) => {
    res.json(req.user);
});

router
    .route('/signup')
    .post(
        sanitizeEmail,
        sanitizeText('username'),
        validateSignupCredentials,
        asyncWrapper(authController.signup),
    );

router
    .route('/login')
    .post(
        sanitizeEmail,
        validateLoginCredentials,
        passport.authenticate('local'),
        (req: Request, res: Response) => {
            res.json({ isAuthenticated: !!req.user });
        },
    );

router.route('/logout').get((req: Request, res: Response) => {
    req.logout();
    res.redirect('/');
});

export default router;
