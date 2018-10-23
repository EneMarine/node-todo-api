const mongoose = require('mongoose');

const Url = process.env.MONGOLAB_URI || `mongodb://localhost:27017/TodoApp`; // Connection URL

// mongoose.Promise = global.Promise; //Paramètre quel type de Promise utiliser
mongoose.connect( Url );

module.exports = { mongoose }
