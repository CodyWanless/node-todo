import * as express from 'express';
import * as bodyParser from 'body-parser';
import registerUserRoutes from './services/user';
import registerTodoRoutes from './services/todo';

import { authenticate } from './middleware/authenticate';

export default class App {
	public expressApp;
	private port: number;

	constructor() {
		this.expressApp = express();
		this.configureApp();
		this.configureRoutes();
	}

	public start() {
		this.expressApp.listen(this.port, () => {
			console.log(`Api started on port: ${this.port}`);
		});
	}

	private configureApp() {
		this.port = (process.env.PORT || 3000) as number;

		this.expressApp.use(bodyParser.json());
	}

	private configureRoutes() {
		registerTodoRoutes(this.expressApp, authenticate);
		registerUserRoutes(this.expressApp, authenticate);
	}
}
