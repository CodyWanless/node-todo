const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

// var todo = new Todo({
//     text: 'text',
//     _id: new ObjectID()
// });
// todo.save();

// Todo.findByIdAndRemove(todo._id).then((todo) => {
//     console.log(todo);
// });
