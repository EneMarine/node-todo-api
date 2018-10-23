const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const app = express();

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

// Listen on port 3000
app.listen( 3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
