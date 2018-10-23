const {SHA256} = require('crypto-js'); //DO NOT USE
const jwt = require('jsonwebtoken');

/***** CRYPTO JS *****/
// let message = 'I am user number 3';
// let hash = SHA256( message ).toString();
//
// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);
//
// let data = {
//     id: 4
// };
// let token = {
//     data,
//     hash: SHA256( JSON.stringify(data) + 'somesecret' ).toString()
// };
//
// //Hacking hehe
// token.data.id = 5;
// token.data.hash = SHA256( JSON.stringify(token.data) ).toString();
//
// let resultHash = SHA256( JSON.stringify(token.data) + 'somesecret' ).toString(); //Hashing + salting
//
// if( resultHash === token.hash ){
//     console.log('Not manipulated');
// }else{
//     console.log('Hacking attempt !! Oh noes !');
// }


/***** JWT *****/
let data = {
    id: 10
}

let token = jwt.sign(data, '123abc');
console.log( token );

let decoded = jwt.verify(token, '123abc');
console.log( decoded );
