import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local';
import * as passport from 'passport';
import { User } from '../models/user';

const register = () => passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
    try {
        const user = await User.findByCredentials(email, password);
        if (user) {
            const token = await user.generateAuthToken();

            return done(null, {
                user,
                token
            });
        }

        return done(null, false);
    } catch (e) {
        return done(e);
    }
}));

export default register;