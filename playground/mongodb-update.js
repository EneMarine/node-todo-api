// const MongoClient = require('mongodb').MongoClient;
// const {MongoClient} = require('mongodb'); //Object destructuring
const {MongoClient, ObjectID} = require('mongodb'); //Object destructuring
const assert = require('assert');

var obj = new ObjectID();

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const Todos = db.collection('Todos');
    const Users = db.collection('Users');

    //findOneAndUpdate
    Todos.findOneAndUpdate({
        _id: new ObjectID('5bcdd4367f4dc45e5479544f')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then( result => {
        console.log(result);
    });

    Users.findOneAndUpdate({
        _id: new ObjectID('5bcdd5657f4dc45e54795450')
    }, {
        $set: {
            name: 'Marine'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then( result => {
        console.log(result);
    });

    // client.close();
});
