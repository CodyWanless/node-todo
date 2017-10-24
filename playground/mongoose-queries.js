const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');

var id = '59efcbe94ce4f428a7c8431a1';

// Todo.find({ _id: id }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({ _id: id }).then((doc) => console.log('Todo: ', doc));

if (ObjectID.isValid(id)) {
    Todo.findById(id)
        .then((todo) => console.log('Todo: ', todo))
        .catch((e) => console.log(e));
} else {
    console.log('Id not valid');
}