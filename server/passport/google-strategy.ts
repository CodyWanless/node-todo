import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user';
import { GoogleAccessToken } from '../models/google-access-token';

export default () => passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findByToken(accessToken);
                if (!user && profile) {
                    const email = profile.emails[0].value;
                    user = await User.findByCredentials(email, undefined);
                    if (!user) {
                        user = new User({ email });
                    }

                    await user.addTokenAndSave(new GoogleAccessToken(accessToken));
                }

                return done(null, {
                    user,
                    token: accessToken
                });
            } catch (e) {
                return done(e);
            }
        }
    )
);