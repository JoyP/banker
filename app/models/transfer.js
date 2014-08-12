'use strict';

var Mongo = require('mongodb');

function Transfer(o){
  this.fromId     = o.fromId;
  this.toId       = o.toIdd;
  this.date       = new Date();
  this.amount     = parseInt(o.amount);
  this.fee        = parseInt(o.fee);
}

Object.defineProperty(Transfer, 'collection', {
  get: function(){return global.mongodb.collection('transfers');}
});

Transfer.create = function(o, cb){
  var p = new Transfer(o);
  Transfer.collection.save(p, cb);
};

Transfer.all = function(cb){
  Transfer.collection.find().toArray(cb);
};

Transfer.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Transfer.collection.findOne({_id:_id}, cb);
};

module.exports = Transfer;
