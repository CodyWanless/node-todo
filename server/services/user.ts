import { ObjectID } from 'mongodb';
import * as _ from 'lodash';
import * as passport from 'passport';

import localAuthorizationRegister from '../passport/local-strategy';
import { User } from '../models/user';

const registerRoutes = (app, authenticate) => {
	localAuthorizationRegister();

	app.post('/local/users', async (req, res) => {
		const body = _.pick(req.body, ['email', 'password']);
		if (!body.email && !body.password) {
			return res.status(400).send();
		}

		var user = new User(body);
		try {
			await user.save();
			const token = await user.generateAuthToken();

			res.header('x-auth', token).send(user);
		} catch (e) {
			res.status(400).send(e);
		}
	});

	app.get('/users/me', authenticate, (req, res) => {
		res.send(req.user);
	});

	app.post('/users/login', passport.authenticate('local', { session: false }),
		(req, res) => {
			try {
				const { user, token } = req.user;
				res.header('x-auth', token).send(user);
			} catch (e) {
				res.status(400).send();
			}
		});

	app.delete('/users/me/token', authenticate, async (req, res) => {
		try {
			await req.user.removeToken(req.token);
			res.status(200).send();
		} catch (e) {
			res.status(400).send();
		}
	});
};

export default registerRoutes;
