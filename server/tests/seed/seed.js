const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'marine@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign( { _id: userOneId.toHexString(), access: 'auth' }, '123abc' ).toString()
    }]
},{
    _id: userTwoId,
    email: 'marine@test.fr',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign( { _id: userTwoId.toHexString(), access: 'auth' }, '123abc' ).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
}];

const populateTodos = done => {
    Todo.remove({}) //Wipe all todos
        .then( () => {
            return Todo.insertMany( todos );
        })
        .then( () => done());
};

const populateUsers = done => {
    User.remove({}) //Wipe all users
        .then( () => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then( () => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
