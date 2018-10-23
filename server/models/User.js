const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: val => validator.isEmail( val ),
            message: props => `${props.value} is not a valid email`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//Methodes d'instance
UserSchema.methods.generateAuthToken = function (){
    let user = this;
    let access = 'auth';
    let token = jwt.sign( { _id: user._id.toHexString(), access }, '123abc').toString();

    user.tokens.push({
        access,
        token
    });
    return user.save().then( () => {
        return token;
    });
};

//Override a method
UserSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();
    return _.pick( userObject, ['_id', 'email'] );
};

const User = mongoose.model( 'User', UserSchema );

module.exports = {User};
