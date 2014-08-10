'use strict';

var Mongo = require('mongodb');
var _     = require('lodash');

function Account(o){
  this.name         = o.name;
  this.color        = o.color;
  this.photo        = o.photo;
  this.type         = o.type;
  this.pin          = o.pin;
  this.balance      = parseInt(o.balance);
  this.dateOpened   = new Date(o.dateOpened);
  this.transactions = [];
}

Object.defineProperty(Account, 'collection', {
  get: function(){return global.mongodb.collection('accounts');}
});

Account.prototype.transaction = function(trans,cb){
};

Account.create = function(o, cb){
  var a = new Account(o);
  Account.collection.save(a, cb);
};

Account.all = function(cb){
  Account.collection.find().toArray(cb);
};

Account.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Account.collection.findOne({_id:_id}, function(err,obj){
    var account = changePrototype(obj);

    cb(account);
  });
};


module.exports = Account;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Account.prototype, obj);
}
