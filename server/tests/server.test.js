const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach( done => {
    Todo.remove({}) //Wipe all todos
        .then( () => {
            return Todo.insertMany( todos );
        })
        .then( () => done());
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        let text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( res => {
                expect( res.body.text ).to.equal(text);
            })
            .end((err, res) => {
                if( err ) return done( err );
                Todo.find({text}).then( todos => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                }).catch( e => done(e) );
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if( err ) return done( err );
                Todo.find().then( todos => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch( e => done(e) );
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( res => {
                expect( res.body.todos.length ).to.equal(2);
            })
            .end( done );
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) //toHexString : renvoie un string plutot qu'un objet
            .expect(200)
            .expect( res => {
                expect( res.body.todo.text ).to.equal( todos[0].text );
            })
            .end( done );
    });

    it('should return 404 if todo not found', done => {
        //make sure you get 404
        let id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`) //toHexString : renvoie un string plutot qu'un objet
            .expect(404)
            .end( done );
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .get(`/todos/123`) //toHexString : renvoie un string plutot qu'un objet
            .expect(404)
            .end( done );
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', done => {
        let id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`) //toHexString : renvoie un string plutot qu'un objet
            .expect(200)
            .expect( res => {
                expect( res.body.todo._id ).to.equal( id );
            })
            .end( (err, res) => {
                if( err ) return done(err);
                Todo.findById( id ).then( todos => {
                    expect(todos).to.not.exist;
                    done();
                }).catch( e => done(e) );
            });
    });

    it('should return 404 if todo not found', done => {
        let id = new ObjectID();
        request(app)
            .delete(`/todos/${id.toHexString()}`) //toHexString : renvoie un string plutot qu'un objet
            .expect(404)
            .end( done );
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .delete(`/todos/123`) //toHexString : renvoie un string plutot qu'un objet
            .expect(404)
            .end( done );
    });
});
