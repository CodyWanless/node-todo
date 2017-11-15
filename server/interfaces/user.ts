import { Document } from 'mongoose';

export interface IUserDocument extends Document {
	email: string;
	password: string;
	tokens: [AccessToken];
}

export class AccessToken {
	public access: string;
	public token: string;

	constructor(access: string, token: string) {
		this.access = access;
		this.token = token;
	}
}
