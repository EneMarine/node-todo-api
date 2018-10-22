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

  // Todos.find({
  //     _id: new ObjectID('5b4b542fde965a6a10735745')
  // }).toArray().then( (docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify( docs, undefined, 2));
  // }, (err) => {
  //     console.log('Unable to fetch Todos', err );
  // } );
  Todos.find({
      _id: new ObjectID('5b4b542fde965a6a10735745')
  }).count().then( (count) => {
      console.log(`Todos count : ${count}`);
  }, (err) => {
      console.log('Unable to fetch Todos', err );
  } );

  Users.find({
      name: 'Marine'
  }).toArray().then( (docs) => {
      console.log('Todos');
      console.log(JSON.stringify( docs, undefined, 2));
  }, (err) => {
      console.log('Unable to fetch Todos', err );
  } );

  client.close();
});
