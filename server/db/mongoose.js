const mongoose = require('mongoose');

const Url = 'mongodb://localhost:27017/'; // Connection URL
const DbName = 'TodoApp'; // Database Name

// mongoose.Promise = global.Promise; //Paramètre quel type de Promise utiliser
mongoose.connect( Url + DbName );

module.exports = { mongoose }
