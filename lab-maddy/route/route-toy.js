'use strict';

const Toy = require('../model/toy');
const errorHandler = require('../lib/error-handler'); //added from code demo have not added this file yet...
const debug = require('debug')('http:route-toy');

module.exports = function(router) {
  router.post('/api/toy', (req, res) => {
    debug('/api/toy POST');

    return new Toy(req.body).save()
      .then(toy => res.status(201).json(toy))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/toy/:_id', (req, res) => {
    debug('/api/toy/:_id GET');

    return Toy.findById(req.params._id)
      .populate('child')
      .then(toy => res.json(toy))//deleted toy.map(toy => toy._ids
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/toy', (req, res) => {
    debug('/api/toy GET');

    return Toy.find()
      .then(toys => res.json(toys.map(toy => toy._id)))
      .catch(err => errorHandler(err, req, res)); //added after code demo
  });

  //Said was a huge help here
  router.put('/api/toy/:_id', (req, res) => { //getting rid of all the nexts becuase we're replacing them wiht errorHandler file
    debug('/api/toy PUT');

    return Toy.findByIdAndUpdate(req.params._id, req.body, { upsert: true, runValidators: true }) //then pass in a few options in {}. new takes a boolean value. upsert, set it to true. If we don't have the run validators and we run a findbyIDandUpdate. this helps validate that if hte string has been changed to a number (mutated), we need to still make sure we meet that criteria.
    //upsert - update/insert- if true and no records match the query, insert update as a new record.
      .then(() => res.sendStatus(204)) //deleted toy
      .catch(err => errorHandler(err, req, res));
  });

  router.delete('/api/toy/:_id', (req, res) => {//added :_id //an isAdmin module after toy could be used to only let an admin drop a full db //don't need :_id after toy?
    debug('/api/toy DELETE');

    return Toy.findByIdAndRemove(req.params._id)
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });
};
