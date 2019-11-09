import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { isEmail } from './helpers/validation';
import User, { UserIdentity } from './models/User';

export default function configurePassport(passport: PassportStatic): void {
    passport.use(
        new Strategy(
            { usernameField: 'emailOrUsername' },
            async (emailOrUsername, password, done) => {
                try {
                    const user = isEmail(emailOrUsername)
                        ? await User.findOne({ email: emailOrUsername })
                        : await User.findOne({ username: emailOrUsername });

                    if (!user) {
                        return done(null, false);
                    }

                    return bcrypt.compare(password, user.password, (err, res) => {
                        if (err) {
                            return done(err, false);
                        }

                        if (!res) {
                            return done(null, false);
                        }

                        return done(null, user);
                    });
                } catch (err) {
                    return done(err, false);
                }
            },
        ),
    );

    passport.serializeUser((user: UserIdentity, done) => done(null, user.id));

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (err) {
            return done(null, false);
        }
    });
}
