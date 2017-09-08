'use strict';

const debug = require('debug')('http:child');
const mongoose = require('mongoose');

const Child = mongoose.Schema({
  name: { type: String, required: true },
  toys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'toy' }] //ref -- needs to reference an actual instane of a toy, this is referencing the    in toy.js
}, { timestamps: true });

module.exports = mongoose.model('child', Child);
