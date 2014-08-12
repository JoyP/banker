'use strict';

var Transaction = require('./transaction');
var Transfer    = require('./transfer');
var Mongo       = require('mongodb');
var _           = require('lodash');

function Account(o){
  this.name         = o.name;
  this.color        = o.color;
  this.photo        = o.photo;
  this.type         = o.type;
  this.pin          = o.pin;
  this.balance      = parseFloat(o.balance);
  this.dateOpened   = new Date();
}

Object.defineProperty(Account, 'collection', {
  get: function(){return global.mongodb.collection('accounts');}
});

Account.create = function(o, cb){
  var a = new Account(o);
  Account.collection.save(a, cb);
};

Account.all = function(cb){
  Account.collection.find().toArray(cb);
};

Account.findById = function(id, cb, isFull){
  var _id = Mongo.ObjectID(id);
  Account.collection.findOne({_id:_id}, function(err, obj){
    var account = _.create(Account.prototype, obj);
    if(!isFull){cb(err, account);return;}

    Transaction.query({accountId:account._id}, function(err, transactions){
      Transfer.query({fromId:account._id}, function(err, transfersOut){
        Transfer.query({toId:account._id}, function(err, transfersIn){
          account.transactions = transactions;
          account.transfersOut = transfersOut;
          account.transfersIn  = transfersIn;
          cb(err, account);
        });
      });
    });
  });
};

Account.prototype.transaction = function(o,cb){
  if(o.pin !== this.pin){cb(); return;}
  o.fee = 0;

  this.balance = o.type === 'deposit' ? (o.amount * 1 + this.balance) : (o.amount * -1 + this.balance);
  if (this.balance < 0){
    o.fee = 50;
    this.Balance -= o.fee;
  }

  Account.collection.save(this, function(cb){
    Transaction.create(o,cb);
  });
};

Account.prototype.transfer = function(o, cb){
  if((o.pin !== this.pin) || (this.balance < (parseFloat(o.amount) + 25))){cb();return;}

  var self = this;
  o.fromId = self._id;
  o.fee = 25;
  o.amount = parseFloat(o.amount);

  Account.findById(o.toId, function(err, receiver){
    self.balance -= (o.amount + o.fee);
    receiver.balance += o.amount;
    Account.collection.save(self, function(){
      Account.collection.save(receiver, function(){
        Transfer.create(o, cb);
      });
    });
  });
};

module.exports = Account;

