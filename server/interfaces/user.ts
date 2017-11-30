import { Document } from 'mongoose';

import { IAccessToken } from './access-token';

export interface IUserDocument extends Document {
	email: string;
	password: string;
	tokens: IAccessToken[];
}
