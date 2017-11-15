import * as validator from 'validator';
import { Schema, model, Document, Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { IUserDocument, AccessToken } from '../interfaces/user';

export interface IUser extends IUserDocument {
	toJSON(): string;
	generateAuthToken(): string;
	removeToken(token: AccessToken): [string];
}

export interface IUserModel extends Model<IUser> {
	findByToken(token: string): IUser;
	findByCredentials(email: string, password: string): IUser;
}

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
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
		required: true,
		minlength: 6
	},
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}
	]
});

userSchema.statics.findByToken = function(token) {
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET as string);
	} catch (e) {
		return Promise.reject(e.toString());
	}

	return this.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

userSchema.methods.toJSON = function() {
	const userObject = this.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
	const access = 'auth';
	const token = jwt
		.sign({ _id: this._id.toHexString(), access }, process.env
			.JWT_SECRET as string)
		.toString();
	this.tokens.push({ access, token });

	return this.save().then(() => {
		return token;
	});
};

userSchema.methods.removeToken = function(token) {
	return this.update({
		$pull: {
			tokens: { token }
		}
	});
};

userSchema.statics.findByCredentials = function(email, password) {
	return this.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject('User not found');
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

userSchema.pre('save', function(next) {
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
