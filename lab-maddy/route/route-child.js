'use strict';

const Child = require('../model/child');
const errorHandler = require('../lib/error-handler'); //added from code demo have not added this file yet...
const debug = require('debug')('http:route-child');

module.exports = function(router) {
  router.post('/api/child', (req, res) => {
    debug('/api/child POST');

    return new Child(req.body).save()
      .then(child => res.status(201).json(child))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/child/:_id', (req, res) => {
    debug('/api/child/:_id GET');

    return Child.findById(req.params._id)
      .populate({ path: 'toys' }) //toys is from child.js //thank you to Said for helping with this
      .then(child => res.json(child))//deleted child.map(child => child._ids
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/child', (req, res) => {
    debug('/api/child GET');

    return Child.find()
      .then(children => res.json(children.map(child => child._id)))
      .catch(err => errorHandler(err, req, res)); //added after code demo
  });

  //Said was a huge help here
  router.put('/api/child/:_id', (req, res) => { //getting rid of all the nexts becuase we're replacing them wiht errorHandler file
    debug('/api/child PUT');

    return Child.findByIdAndUpdate(req.params._id, req.body, { upsert: true, runValidators: true }) //then pass in a few options in {}. new takes a boolean value. upsert, set it to true. If we don't have the run validators and we run a findbyIDandUpdate. this helps validate that if hte string has been changed to a number (mutated), we need to still make sure we meet that criteria.
    //upsert - update/insert- if true and no records match the query, insert update as a new record.
      .then(() => res.sendStatus(204)) //deleted child
      .catch(err => errorHandler(err, req, res));
  });

  router.delete('/api/child/:_id', (req, res) => {//added :_id //an isAdmin module after child could be used to only let an admin drop a full db //don't need :_id after child?
    debug('/api/child DELETE');

    return Child.findByIdAndRemove(req.params._id)
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });
};
