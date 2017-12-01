import { User } from './../models/user';

const authenticate = async (req, res, next) => {
	var token = req.header('x-auth');

	try {
		const user = await User.findByToken(token);
		if (!user) {
			return res.status(401).send();
		}

		req.user = user;
		req.token = token;
		next();
	} catch (e) {
		res.status(401).send();
	}
};

export { authenticate };
