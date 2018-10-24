const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach( populateTodos );
beforeEach( populateUsers );

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

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        let id = todos[0]._id.toHexString();
        let text = 'Updated first todo';
        request(app)
            .patch(`/todos/${id}`) //toHexString : renvoie un string plutot qu'un objet
            .send({
                text,
                completed: true
            })
            .expect(200)
            .end( (err, res) => {
                if( err ) return done(err);
                Todo.findById( id ).then( todos => {
                    expect( todos.text ).to.equal( text );
                    expect( todos.completed ).to.equal( true );
                    expect( todos.completedAt ).to.be.a( 'number' );
                    done();
                }).catch( e => done(e) );
            });
    });

    it('should clear completedAt when todo is not completed', done => {
        let id = todos[1]._id.toHexString();
        let text = 'Updated second todo';
        request(app)
            .patch(`/todos/${id}`) //toHexString : renvoie un string plutot qu'un objet
            .send({
                text,
                completed: false
            })
            .expect(200)
            .end( (err, res) => {
                if( err ) return done(err);
                Todo.findById( id ).then( todos => {
                    expect( todos.text ).to.equal( text );
                    expect( todos.completed ).to.equal( false );
                    expect( todos.completedAt ).to.be.equal( null );
                    done();
                }).catch( e => done(e) );
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token )
            .expect(200)
            .expect( res => {
                expect( res.body._id ).to.equal(users[0]._id.toHexString());
                expect( res.body.email ).to.equal(users[0].email);
            })
            .end( done );
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect( res => {
                expect( res.body ).to.eql({});
            })
            .end( done );
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        let email = 'test@test.fr';
        let password = '123456789';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect( res => {
                expect( res.headers['x-auth'] ).to.exist;
                expect( res.body._id ).to.exist;
                expect( res.body.email ).to.equal(email);
            })
            .end( err => {
                if( err ) return done(err);
                User.findOne({email}).then( user => {
                    expect(user).to.exist;
                    expect(user.password).to.not.equal(password);
                    done();
                }).catch( e => done(err) );
            } );
    });

    it('should return validation errors if email invalid', done => {
        let email = 'test';
        let password = '123456789';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end( done );
    });

    it('should return validation errors if password invalid', done => {
        let email = 'test1@test.fr';
        let password = '123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end( done );
    });

    it('should not create user if email in use', done => {
        let email = users[0].email;
        let password = '123456789';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end( done );
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        let credentials = {
            email: users[1].email,
            password: users[1].password,
        }
        request(app)
            .post('/users/login')
            .send(credentials)
            .expect(200)
            .expect( res => {
                expect( res.headers['x-auth'] ).to.exist;
            })
            .end( (err, res) => {
                if( err ) return done(err);
                User.findById(users[1]._id).then( user => {
                    expect(user.tokens[0]).to.include({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch( e => done(err) );
            });
    });

    it('should reject invalid login (bad email)', done => {
        let credentials = {
            email: 'test@test.fr',
            password: users[1].password,
        }
        request(app)
            .post('/users/login')
            .send(credentials)
            .expect(400)
            .expect( res => {
                expect( res.headers['x-auth'] ).to.not.exist;
            })
            .end( (err, res) => {
                if( err ) return done(err);
                User.findById(users[1]._id).then( user => {
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch( e => done(err) );
            });
    });

    it('should reject invalid login (bad password)', done => {
        let credentials = {
            email: users[1].email,
            password: '123456789',
        }
        request(app)
            .post('/users/login')
            .send(credentials)
            .expect(400)
            .expect( res => {
                expect( res.headers['x-auth'] ).to.not.exist;
            })
            .end( (err, res) => {
                if( err ) return done(err);
                User.findById(users[1]._id).then( user => {
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch( e => done(err) );
            });
    });
});
