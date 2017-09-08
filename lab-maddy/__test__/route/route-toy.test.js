'use strict';

require('dotenv').config({ path: `${_dirname}/lib/.test.env`
});

const Toy = require('../../model/toy'); //added this after today's code review
const superagent = require('superagent');

require('../lib/server').listen(3000); //removed .. //starts up the server, the listen actually kicks off the Listen open resond close loop.
require('jest');

describe('Testing toy routes', function() {
  describe('all requests to /api/toy', () => {
    describe('POST requests', () => {
      describe('Valid Requests', () => {
        beforeAll(done => {
          superagent.post(':3000/api/toy')
            .type('application/json')
            .send({
              name: 'barney',
              desc: 'purple dino'
            })
            .then(res => {
              this.mockToy = res.body
              this.resPost = res
              done();
            });
        });
        test('should create and return a new toy, given a valid request', () => {
          expect(this.mockToy).toBeInstanceOf(Object);
          expect(this.mockToy).toHaveProperty('name')
          expect(this.mockToy).toHaveProperty('desc');
          expect(this.mockToy).toHaveProperty('_id');
        })
        test('should have a name, given a valid request', () => {
          expect(this.mockToy.name).toBe('barney');
        })
        test('should have a desc, given a valid request', () => {
          expect(this.mockToy.desc).toBe('purple dino');
        })
        test('should have an _id, given a valid request', () => {
          expect(this.mockToy._id).toMatch(/([a-f0-9]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)/i) //
        })
        test('should return a 201 CREATED, given a valid request', () => {
          expect(this.resPost.status).toBe(201)
        })
      })
      describe('Invalid Requests', () => {
        // TODO: error status, message, name, bad endpoint
        beforeAll(done => {
          superagent.post(':3000/api/toy')
            .type('application/json')
            .send({})
            .catch(err => {
              this.errPost = err
              done()
            })
        })
        test('should return a status of 400 Bad Request', () => {
          expect(this.errPost.status).toBe(400)
          expect(this.errPost.message).toBe('Bad Request')
        })
        test('should return 404 on invalid endpoint', done => {
          superagent.post(':3000/bad/endpoint')
            .type('application/json')
            .send({})
            .catch(err => {
              expect(err.status).toBe(404)
              done()
            })
        })
      })
    })
    xdescribe('GET requests', () => {
      test('should get the record from the toy dir', done => {

        done()
      })
    })
    xdescribe('PUT requests', function() { //adding after code review
      // test('should have ...', done => { //code review
      beforeAll(() => {
        return superagent.post(':3000/api/toy') //should this be .post or .put
          .send({
            name: 'Aaron',
            desc: 'human'
          })
          .then(res => {
            this.resPost = res;
          });
      });
      afterAll(() => {
        return Promise.all([
          Toy.remove()
        ])
        // .then(()=> delete this.resPost)
      })
      // done() //why is this not in code review?
    })

    describe('Valid Requests', () => {
      test('should return a status of 204 No Content', () => {
        return superagent.put(`:3000/api/toy/${this.resPost.body._id}`)
          .send({
            name: 'Aaron',
            desc: 'human'
          })
          .then(res => {
            expect(res.status).toBe(204)
          })
      })
      test('should update the existing record in the DB', () => {
        return superagent.get(`:3000/api/toy/${this.resPost.body._id}`)
          .then(res => {
            expect(res.body.name).toBe('Aaron')
            expect(res.body.desc).toBe('human')
          })
      })
    })
    describe('Invalid Requests', () => {

    })
  })
  describe('DELETE requests', () => {
    describe('Valid Requests', () => {
      beforeAll(done => {
        superagent.delete(`:3000/api/toy/${this.mockToy._id}`)
          .then(res => {
            this.resDelete = res
            done()
          })
      })
      test('should return a 204 No Content', () => {
        expect(this.resDelete.status).toBe(204)
      })
      test('should remove the record from the toy dir', done => {
        fs.readdirProm(`${__dirname}/../../data/toy`)
          .then(files => {
            let expectedFalse = files.includes(`${this.mockToy._id}.json`)
            expect(expectedFalse).toBeFalsy()
            done()
          })
      })
    })
    describe('Invalid Requests', () => {

    })
  })
})
