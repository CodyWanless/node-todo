import * as passport from 'passport';

import registerGoogleAuth from '../passport/google-strategy';

const registerRoutes = (app, authenticate) => {

    registerGoogleAuth();

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        session: false
    }),
        (req, res) => {
            try {
                const { user, token } = req.user;
                res.header('x-auth', token).send(user);
            } catch (e) {
                res.status(400).send();
            }
        });

};

export default registerRoutes;