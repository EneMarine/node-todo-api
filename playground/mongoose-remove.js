const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/Todo');

// Remove all
Todo.remove({}).then( result => {
    console.log(result);
});

// Remove one
Todo.findOneAndRemove({text}).then( result => {
    console.log(result);
});

// Remove one by ID
Todo.findByIdAndRemove('asdf').then( result => {
    console.log(result);
});
