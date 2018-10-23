const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const app = express();
const port = process.env.PORT || 3000; // use port 3000 unless there exists a preconfigured port

//Middleware
app.use( bodyParser.json() );

//POST API
app.post( '/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET api
app.get( '/todos', (req, res) => {
    Todo.find().then( todos => {
        res.send({todos});
    }, e => {
        res.status(400).send(e);
    });
});

app.get( '/todos/:id', (req, res) => {
    let id = req.params.id;
    if( !ObjectID.isValid(id) ) return res.status(404).send();

    Todo.findById( id ).then( todo => {
        if( !todo ) return res.status(404).send();
        res.send( {todo} )
    }).catch( e => res.status(400).send() );
});

// Listen on port
app.listen( port, () => {
    console.log( `Started on port ${port}`);
});

module.exports = {app};
