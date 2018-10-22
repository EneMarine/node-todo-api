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

  // Insert some documents
  // Users.insertOne({
  //     name: 'Marine',
  //     age: 23,
  //     location: 'Rennes'
  // }, (err, result) => {
  //   assert.equal(err, null);
  //   assert.equal(1, result.result.n);
  //   assert.equal(1, result.ops.length);
  //   console.log("Inserted 1 document into the collection");
  //   console.log( JSON.stringify(result.ops, undefined, 2) );
  //   console.log( result.ops[0]._id.getTimestamp() );
  // });
  // Todos.insertOne({
  //     text: 'Something to do',
  //     completed: false
  // }, (err, result) => {
  //   assert.equal(err, null);
  //   assert.equal(1, result.result.n);
  //   assert.equal(1, result.ops.length);
  //   console.log("Inserted 1 document into the collection");
  //   console.log( JSON.stringify(result.ops, undefined, 2) );
  // });
  // Todos.insertMany([
  //   {a : 1}, {a : 2}, {a : 3}
  // ], function(err, result) {
  //   assert.equal(err, null);
  //   assert.equal(3, result.result.n);
  //   assert.equal(3, result.ops.length);
  //   console.log("Inserted 3 documents into the collection");
  //   callback(result);
  // });

  client.close();
});
