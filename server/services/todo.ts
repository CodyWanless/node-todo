import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { Todo } from '../models/todo';
import { TodoFactory } from '../models/todo-factory';

const registerRoutes = (app, authenticate) => {
	app.post('/todos', authenticate, async (req, res) => {
		try {
			const todo = TodoFactory.createFromRequest(req.body);

			const doc = await todo.save();
			res.send(doc);
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.get('/todos', authenticate, async (req, res) => {
		try {
			const todos = await Todo.find({
				_creator: req.user._id
			});
			res.send({ todos });
		} catch (e) {
			res.status(400).send(e);
		}
	});

	app.get('/todos/:id', authenticate, async (req, res) => {
		const todoId = req.params.id;

		if (ObjectID.isValid(todoId)) {
			try {
				const todo = await Todo.findOne({
					_id: todoId,
					_creator: req.user._id
				});
				if (!todo) {
					return res.status(404).send();
				}

				res.send({ todo });
			} catch (e) {
				res.status(400).send();
			}
		} else {
			res.status(404).send();
		}
	});

	app.delete('/todos/:id', authenticate, async (req, res) => {
		const todoId = req.params.id;
		if (!ObjectID.isValid(todoId)) {
			return res.status(404).send();
		}

		try {
			const todo = await Todo.findOneAndRemove({
				_id: todoId,
				_creator: req.user._id
			});

			if (!todo) {
				return res.status(404).send();
			}

			res.send({ todo });
		} catch (e) {
			res.status(400).send();
		}
	});

	app.patch('/todos/:id', authenticate, async (req, res) => {
		const todoId = req.params.id;
		if (!ObjectID.isValid(todoId)) {
			return res.status(404).send();
		}

		const body = _.pick(req.body, [
			'text',
			'completed',
			'priority',
			'checklistItems',
			'completeBy'
		]);
		if (_.isBoolean(body.completed) && body.completed) {
			body.completedAt = new Date().getTime();
		} else {
			body.completed = false;
			body.completedAt = null;
		}

		try {
			const todo = await Todo.findOneAndUpdate(
				{
					_id: todoId,
					_creator: req.user._id
				},
				{ $set: body },
				{ new: true }
			);

			if (!todo) {
				return res.status(404).send();
			}

			res.send({ todo });
		} catch (e) {
			res.status(400).send();
		}
	});
};

export default registerRoutes;
