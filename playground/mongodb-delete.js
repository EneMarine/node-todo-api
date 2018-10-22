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

    //deleteMany
    // Todos.deleteMany({text: 'Eat lunch'})
    //     .then( (result) => {
    //         console.log(result);
    // });

    //deleteOne
    // Todos.deleteOne({text: 'Eat lunch'})
    //     .then( (result) => {
    //         console.log(result);
    //     });

    //findOneAndDelete (best one)
    // Todos.findOneAndDelete({completed: false})
    //     .then( (result) => {
    //         console.log(result);
    //     });

    //Challenge
    Users.deleteMany({name: 'Marine'})
        .then( (result) => {
            console.log(result);
    });

    Users.findOneAndDelete({_id: new ObjectID('5bcdd5339b0e5f5e54757500')})
        .then( (result) => {
            console.log(result);
        });

    // client.close();
});
