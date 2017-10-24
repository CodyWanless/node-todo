const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59efb749aac8f1ee92317435')
    // }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     }).then((result) => console.log(result));

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59efba36aac8f1ee923175b2')
    }, {
            $set: {
                name: 'Yankee'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => console.log(result));

    // db.close();
});