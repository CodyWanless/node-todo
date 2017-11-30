import * as validator from 'validator';
import { Schema, model, Document, Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { IUserDocument } from '../interfaces/user';
import { IAccessToken } from '../interfaces/access-token';
import { LocalAccessToken } from './local-access-token';
import { GoogleAccessToken } from './google-access-token';
import AccessTokenFactory from './access-token-factory';

export interface IUser extends IUserDocument {
	toJSON(): string;
	generateAuthToken(): string;
	addTokenAndSave(token: IAccessToken): void;
	removeToken(token: IAccessToken): string[];
}

export interface IUserModel extends Model<IUser> {
	findByToken(token: string): IUser;
	findByCredentials(email: string, password?: string): IUser;
}

const accessTokenSchema = new Schema({
	access: String,
	token: String,
	strategy: {
		type: String,
		required: true
	}
});

const userSchema = new Schema({
	email: {
		type: String,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		minlength: 6
	},
	tokens: [accessTokenSchema]
});

userSchema.statics.findByToken = async function (token) {
	const user = await this.findOne({
		'tokens.token': token,
		'tokens.access': 'auth'
	});

	if (!user) {
		return null;
	}

	const userToken = AccessTokenFactory(user.tokens.filter(x => x.token === token)[0]);
	if (userToken && userToken.verify()) {
		return user;
	}

	return null;
};

userSchema.methods.toJSON = function () {
	const userObject = this.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
	const access = 'auth';
	const token = jwt
		.sign({ _id: this._id.toHexString(), access }, process.env
			.JWT_SECRET as string)
		.toString();
	this.tokens.push(new LocalAccessToken(access, token));

	return this.save().then(() => {
		return token;
	});
};

userSchema.methods.addTokenAndSave = function (token: IAccessToken) {
	this.tokens.push(token);

	return this.save();
};

userSchema.methods.removeToken = function (token) {
	return this.update({
		$pull: {
			tokens: { token }
		}
	});
};

userSchema.statics.findByCredentials = function (email, password) {
	return this.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject('User not found');
		}

		if (password && user.password) {
			return new Promise((resolve, reject) => {
				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						resolve(user);
					} else {
						reject();
					}
				});
			});
		} else {
			return Promise.resolve(user);
		}
	});
};

userSchema.pre('save', function (next) {
	if (this.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(this.password, salt, (err, hash) => {
				this.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
