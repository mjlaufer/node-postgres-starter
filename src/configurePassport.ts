import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import db from '@db';
import { makeUser } from '@features/user/user-helpers';
import { User } from '@types';
import { NotFoundError } from '@errors';

export default function configurePassport(passport: PassportStatic): void {
    passport.use(
        new Strategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const userEntity = await db.users.findOne({ email });

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

                    return done(null, makeUser(userEntity));
                });
            } catch (err) {
                return done(err, false);
            }
        }),
    );

    // @ts-expect-error
    passport.serializeUser((user: User, done) => done(null, user.id));

    passport.deserializeUser(async (id: string, done) => {
        try {
            const userEntity = await db.users.findById(id);
            if (!userEntity) {
                throw new NotFoundError(`Could not find user with ID ${id}`);
            }
            const user: User = makeUser(userEntity);
            return done(null, user);
        } catch {
            return done(null, false);
        }
    });
}
