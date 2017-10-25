require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id;

    if (ObjectID.isValid(todoId)) {
        Todo.findById(todoId)
            .then((todo) => {
                if (!todo) {
                    return res.status(404).send();
                }

                res.send({ todo });
            })
            .catch((e) => res.status(400).send());
    } else {
        res.status(404).send();
    }
});

app.delete('/todos/:id', (req, res) => {
    const todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(todoId)
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(todoId, { $set: body }, { new: true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch(e => res.status(400).send());
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };