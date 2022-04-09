import express, { Request, Response } from 'express';
import passport from 'passport';
import * as authController from '@features/auth/auth-controller';
import { sanitizeEmail, sanitizeText } from '@middleware/sanitizers';
import { validateLoginCredentials, validateSignupCredentials } from '@middleware/validators';

const router = express.Router();

router.route('/current-user').get((req: Request, res: Response) => {
    if (req.user) {
        res.json(req.user);
    }
    res.status(401).end();
});

router
    .route('/signup')
    .post(
        sanitizeEmail,
        sanitizeText('username'),
        validateSignupCredentials,
        authController.signup,
    );

router
    .route('/login')
    .post(
        sanitizeEmail,
        validateLoginCredentials,
        passport.authenticate('local'),
        (req: Request, res: Response) => {
            res.json({ isAuthenticated: true });
        },
    );

router.route('/logout').get((req: Request, res: Response) => {
    req.logout();
    res.redirect('/');
});

export default router;
