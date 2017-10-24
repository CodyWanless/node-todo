const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({ text: 'Eat tuss' })
    //     .then((result) => console.log(result));

    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'Test' })
    //     .then((result) => console.log(result));

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed: false })
    //     .then((result) => console.log(result));

    // db.collection('Users').deleteMany({ name: 'Cody' })
    //     .then((result) => console.log(result));

    // db.collection('Users').findOneAndDelete({ _id: new ObjectID('59efb1aae7ac85a2b23fa9b5') })
    //     .then((result) => console.log(result));

    // db.close();
});