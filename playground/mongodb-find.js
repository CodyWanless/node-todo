const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('59efafa07cb403a25d95bf01')
    // }).toArray()
    //     .then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    //     });
    db.collection('Users').find({
        name: 'Cody'
    }).toArray()
        .then((users) => {
            console.log('Todos');
            console.log(JSON.stringify(users, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch todos', err);
        });

    // db.close();
});