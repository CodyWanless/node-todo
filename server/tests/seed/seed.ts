import { ObjectID } from 'mongodb';
import { Todo } from './../../models/todo';
import { User } from './../../models/user';
import * as jwt from 'jsonwebtoken';
import { LocalAccessToken } from '../../models/local-access-token';

const secretKey: string = process.env.JWT_SECRET as string;
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
	{
		_id: userOneId,
		email: 'andrew@example.com',
		password: 'userOnePass',
		tokens: [
			new LocalAccessToken('auth', jwt.sign({ _id: userOneId, access: 'auth' }, secretKey).toString())
		]
	},
	{
		_id: userTwoId,
		email: 'jen@example.com',
		password: 'userTwoPass',
		tokens: [
			new LocalAccessToken('auth', jwt.sign({ _id: userTwoId, access: 'auth' }, secretKey).toString())
		]
	}
];

const todos = [
	{
		text: 'First test todo',
		_id: new ObjectID(),
		_creator: userOneId
	},
	{
		text: 'Second test todo',
		completed: true,
		completedAt: new Date().getTime(),
		_id: new ObjectID(),
		_creator: userTwoId
	}
];

const populateTodos = done => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos);
		})
		.then(() => done())
		.catch(e => done(e));
};

const populateUsers = done => {
	User.remove({})
		.then(() => {
			var userOne = new User(users[0]).save();
			var userTwo = new User(users[1]).save();

			return Promise.all([userOne, userTwo]);
		})
		.then(() => done())
		.catch(e => done(e));
};

export { todos, populateTodos, users, populateUsers };
