import { ObjectID } from 'mongodb';
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
import * as jwt from 'jsonwebtoken';

const secretKey: string = process.env.JWT_SECRET as string;
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
	{
		_id: userOneId,
		email: 'andrew@example.com',
		password: 'userOnePass',
		tokens: [
			{
				access: 'auth',
				token: jwt
					.sign({ _id: userOneId, access: 'auth' }, secretKey)
					.toString()
			}
		]
	},
	{
		_id: userTwoId,
		email: 'jen@example.com',
		password: 'userTwoPass',
		tokens: [
			{
				access: 'auth',
				token: jwt
					.sign({ _id: userTwoId, access: 'auth' }, secretKey)
					.toString()
			}
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
