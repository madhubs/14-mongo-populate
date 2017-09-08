'use strict';


const debug = require('debug')('http:model-toy');
const Child = require('../model/child');
const mongoose = require('mongoose');

const Toy = mongoose.Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  child: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'child'}
}, {timestamps: true});

Toy.pre('save', function(next) { //this pre save hook is
  debug('#pre-save Toy');

  Child.findById(this.child)
    .then(child => {
      let toyIdSet = new Set(child.toys); //casting it to a set and then checking for duplicates...
      toyIdSet.add(this._id); // only going to to add if the _id isn't already present in the set
      child.toys = Array.from(toyIdSet);
      return child.save();
    })
    .then(next)
    .catch(() => next(new Error('validation failed to create toy because child does not exist')));
});

Toy.post('remove', function(doc, next) { //passing the toy/doc we've deleted into this, find the id, filter, and remove.
  debug('#post-remove Toy');

  Child.findById(doc.child)
    .then(child => {
      // [1, 2, 3, 4] => [1, 2, 3]
      child.toys = child.toys.filter(toy => toy._id === doc._id);
      return child.save(); //becuase we've modified the doc be removing it's id we must save 
    })
    .then(next)
    .catch(next);
});

module.exports = mongoose.model('toy', Toy);
