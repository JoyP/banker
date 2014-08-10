'use strict';

var Mongo = require('mongodb');

function Transaction(o){
  this.name  = o.name;
  this.color = o.color;
  this.value = parseInt(o.value);
}

Object.defineProperty(Transaction, 'collection', {
  get: function(){return global.mongodb.collection('transactions');}
});

Transaction.create = function(o, cb){
  var p = new Transaction(o);
  Transaction.collection.save(p, cb);
};

Transaction.all = function(cb){
  Transaction.collection.find().toArray(cb);
};

Transaction.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Transaction.collection.findOne({_id:_id}, cb);
};

module.exports = Transaction;
