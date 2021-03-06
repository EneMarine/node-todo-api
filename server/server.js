require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000; // use port 3000 unless there exists a preconfigured port

//Middleware
app.use( bodyParser.json() );

//POST API
app.post( '/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then( doc => {
        res.send(doc);
    }).catch( e => {
        res.status(400).send(e);
    });
});

//GET api
app.get( '/todos', authenticate, (req, res) => {
    Todo.find( {_creator: req.user._id} ).then( todos => {
        res.send({todos});
    }, e => {
        res.status(400).send(e);
    });
});

app.get( '/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if( !ObjectID.isValid(id) ) return res.status(404).send();

    Todo.findOne( { _id: id, _creator: req.user._id } ).then( todo => {
        if( !todo ) return res.status(404).send();
        res.send( {todo} )
    }).catch( e => res.status(400).send() );
});

//DELETE api
app.delete( '/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if( !ObjectID.isValid(id) ) return res.status(404).send();

    Todo.findOneAndRemove( { _id: id, _creator: req.user._id } ).then( todo => {
        if( !todo ) return res.status(404).send();
        res.send( {todo} )
    }).catch( e => res.status(400).send() );
});

//UPDATE api (Patch)
app.patch( '/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick( req.body, ['text', 'completed'] );
    if( !ObjectID.isValid(id) ) return res.status(404).send();

    if( _.isBoolean(body.completed) && body.completed ){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate( { _id: id, _creator: req.user._id }, { $set: body }, {new: true}).then( todo => {
        if( !todo ) return res.status(404).send();
        res.send( {todo} );
    }).catch( e => {
        res.status(400).send();
    });
});

// POST /users
app.post( '/users', (req, res) => {
    let body = _.pick( req.body, ['email', 'password'] );
    let user = new User(body);

    user.save().then( () => {
        return user.generateAuthToken();
    }).then( token => {
        res.header( 'x-auth', token ).send(user);
    }).catch( e => {
        res.status(400).send(e);
    });
});

app.post( '/users/login', (req, res) => {
    let body = _.pick( req.body, ['email', 'password'] );

    User.findByCredentials( body.email, body.password ).then( user => {
        return user.generateAuthToken().then( token => {
            res.header( 'x-auth', token ).send(user);
        });
        res.send(user);
    }).catch( e => {
        res.status(400).send();
    });
});

//GET current user
app.get( '/users/me', authenticate, (req, res) => {
    res.send( req.user );
});

//DELETE token
app.delete( '/users/me/token', authenticate, (req, res) => {
    req.user.removeToken( req.token ).then( () => {
        res.status(200).send();
    }).catch( () => {
        res.status(400).send();
    });
});

// Listen on port
app.listen( port, () => {
    console.log( `Started on port ${port}`);
});

module.exports = {app};
