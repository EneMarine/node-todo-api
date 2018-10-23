const mongoose = require('mongoose');

const Url = 'mongodb://localhost:27017/'; // Connection URL
const DbName = 'TodoApp'; // Database Name

// mongoose.Promise = global.Promise; //Paramètre quel type de Promise utiliser
mongoose.connect( Url + DbName );

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Number,
        default: null
    }
});
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const Todo = mongoose.model( 'Todo', TodoSchema );
const User = mongoose.model( 'User', TodoSchema );

let newTodo =  new Todo({
    text: 'Eat dinner'
});

newTodo.save().then( doc => {
    console.log('Saved todo', doc);
},
(e) => {
    console.log('Unable to save todo');
});
