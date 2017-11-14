import './config/config';
import './db/mongoose';

import App from './app';

const app = new App();
app.start();

export default app.expressApp;
