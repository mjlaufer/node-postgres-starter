import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { UserEntity } from '../types';
import { db } from '../model/db';
import User from '../model/User';
import { emailValidator } from '../schemas';

export default function configurePassport(passport: PassportStatic): void {
    passport.use(
        new Strategy(
            { usernameField: 'emailOrUsername' },
            async (emailOrUsername, password, done) => {
                try {
                    const { error } = emailValidator.validate(emailOrUsername);

                    const userEntity: UserEntity | null = error
                        ? await db.users.findOne({ username: emailOrUsername })
                        : await db.users.findOne({ email: emailOrUsername });

                    if (!userEntity) {
                        return done(null, false);
                    }

                    return bcrypt.compare(password, userEntity.password, (err, res) => {
                        if (err) {
                            return done(err, false);
                        }

                        if (!res) {
                            return done(null, false);
                        }

                        return done(null, new User(userEntity));
                    });
                } catch (err) {
                    return done(err, false);
                }
            },
        ),
    );

    passport.serializeUser((user: User, done) => done(null, user.id));

    passport.deserializeUser(async (id: number, done) => {
        try {
            const userEntity: UserEntity = await db.users.findById(id);
            const user: User = new User(userEntity);
            return done(null, user);
        } catch {
            return done(null, false);
        }
    });
}
