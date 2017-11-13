const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', done => {
		var text = 'test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({ text })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(2);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('Get /todos', () => {
	it('should get all todos', done => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should get a todo by its id', done => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 when not found', done => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 when bad request', done => {
		request(app)
			.get('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should not get a todo created by other user', done => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete a todo by its id', done => {
		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(todos[0]._id)
					.then(todo => {
						expect(todo).toBeFalsy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should not delete a todo under a different user', done => {
		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(todos[0]._id)
					.then(todo => {
						expect(todo).toBeTruthy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should return 404 when not found', done => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 when bad request', done => {
		request(app)
			.delete('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', done => {
		var body = {
			text: 'Update text',
			completed: true
		};
		request(app)
			.patch(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(body)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
				expect(res.body.todo.completed).toBe(body.completed);
				expect(res.body.todo.text).toBe(body.text);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});

	it('should not update a todo for another user', done => {
		var body = {
			text: 'Update text',
			completed: true
		};
		request(app)
			.patch(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.send(body)
			.expect(404)
			.expect(res => {
				expect(res.body.todo).toBeFalsy();
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed', done => {
		var body = {
			text: 'Update text',
			completed: false
		};

		request(app)
			.patch(`/todos/${todos[1]._id.toHexString()}`)
			.send(body)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
				expect(res.body.todo.text).toBe(body.text);
				expect(res.body.todo.completed).toBe(body.completed);
				expect(res.body.todo.completedAt).toBeFalsy();
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', done => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', done => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', done => {
		const email = 'example@example.com';
		const password = 'abc123!';

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(200)
			.expect(res => {
				expect(res.body.email).toBe(email);
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.find({ email })
					.then(users => {
						expect(users.length).toBe(1);
						expect(users[0].email).toBe(email);
						expect(users[0].password).not.toBe(password);

						done();
					})
					.catch(e => done(e));
			});
	});

	it('should return valdiation errors if request invalid', done => {
		const email = 'merp';
		const password = 'merp';

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(400)
			.end(done);
	});

	it('should not create a user if email in use', done => {
		const email = users[0].email;
		const password = 'thisisapassword';

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', done => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id)
					.then(user => {
						expect(user.toObject().tokens[1]).toMatchObject({
							access: 'auth',
							token: res.headers['x-auth']
						});
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should reject invalid login', done => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'derp'
			})
			.expect(400)
			.expect(res => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id)
					.then(user => {
						expect(user.tokens.length).toBe(1);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', done => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id)
					.then(user => {
						expect(user.tokens.length).toBe(0);
						done();
					})
					.catch(e => done(e));
			});
	});
});
