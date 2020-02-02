import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth-controller';
import { signupSchema, loginSchema } from '../helpers/validation';
import asyncWrapper from '../middleware/asyncWrapper';
import { sanitizeEmail, createTextSanitizer } from '../middleware/sanitizers';
import { validateBody } from '../middleware/validators';

const router = express.Router();

router.route('/current-user').get((req, res) => {
    res.json(req.user);
});

router
    .route('/signup')
    .post(
        [sanitizeEmail, createTextSanitizer('username')],
        validateBody(signupSchema),
        asyncWrapper(authController.signup),
    );

router
    .route('/login')
    .post(sanitizeEmail, validateBody(loginSchema), passport.authenticate('local'), (req, res) => {
        res.json({ isAuthenticated: !!req.user });
    });

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;
