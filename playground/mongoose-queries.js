const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');

// const id = '5bcee429fcf3ef6ff88593f9';
const id = '5bcee429fcf3ef6ff88593f99';

//Check if ID is valid
if( !ObjectID.isValid(id) ) return console.log('Id not valid');

//Find All
Todo.find().then( todos => {
    console.log('Find all', todos);
})

//Find all with parameters
Todo.find({
    _id: id
}).then( todos => {
    console.log('Find all with parameters', todos); //Renvoie un array
}).catch( e => console.log(e) );

//Find one
Todo.findOne({
    _id: id
}).then( todos => {
    if( !todos ) return console.log('Id not found');
    console.log('Find one', todos); //Renvoie l'entrée uniquement
}).catch( e => console.log(e) );

//Find by id
Todo.findById(id).then( todos => {
    if( !todos ) return console.log('Id not found');
    console.log('Find by id', todos); //Renvoie l'entrée uniquement
}).catch( e => console.log(e) );
