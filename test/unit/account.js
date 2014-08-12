/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect      = require('chai').expect;
var Account     = require('../../app/models/account');
var dbConnect   = require('../../app/lib/mongodb');
var Mongo       = require('mongodb');
var cp          = require('child_process');
var db          = 'banker-test';

describe('Account', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      console.log(stdout, stderr);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Account object', function(){
      var o = {name:'Bob', color:'fff000', photo:'http://www.google.com', type:'checking', pin:'4563', balance:'500', dateOpened:'04/15/2013'};
      var a = new Account(o);
      expect(a).to.be.instanceof(Account);
      expect(a.name).to.equal('Bob');
      expect(a.color).to.equal('fff000');
      expect(a.photo).to.equal('http://www.google.com');
      expect(a.type).to.equal('checking');
      expect(a.pin).to.equal('4563');
      expect(a.balance).to.equal(500);
    });
  });

  describe('.create', function(){
    it('should save a new Account object', function(done){
      Account.create({name:'Rachel', color:'ff5050', photo:'http://www.npmjs.org', type:'checking', pin:'4563', balance:'1000'},function(err,account){
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        expect(account).to.be.instanceof(Account);
        expect(account.name).to.equal('Rachel');
        expect(account.photo).to.equal('http://www.npmjs.org');
        done();
      });
    });
  });

  describe('.all', function(){
    it('should find all accounts', function(done){
      Account.all(function(err, accounts){
        expect(accounts).to.have.length(4);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find an account by its id - as string', function(done){
      Account.findById('53d01ddf4fbbd6de0b662201', function(err, account){
        expect(account.name).to.equal('Audrey');
        expect(account).to.be.instanceof(Account);
        done();
      });
    });
  });

describe('#transaction', function(){
    it('should create a transaction - deposit', function(done){
      Account.findById('53d01ddf4fbbd6de0b662204', function(err, account){
        account.transaction({type:'deposit', pin:'1834', amount:'100'}, function(err, transaction){
          console.log(transaction);
          expect(transaction.type).to.equal('deposit');
          expect(transaction.amount).to.equal(100);
          expect(transaction.fee).to.equal(0);
          expect(transaction.accountId).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should not create a transaction - bad pin', function(done){
      Account.findById('53d01ddf4fbbd6de0b662201', function(err, account){
        account.transaction({type:'deposit', pin:'2341', amount:'100'}, function(err, transaction){
          expect(transaction).to.be.undefined;
          done();
        });
      });
    });

    it('should create a transaction - withdraw', function(done){
      Account.findById('53d01ddf4fbbd6de0b662201', function(err, account){
        account.transaction({type:'withdraw', pin:'4387', amount:'100'}, function(err, transaction){
          console.log(transaction);
          expect(account.balance).to.equal(600);
          expect(transaction.amount).to.equal(100);
          expect(transaction.fee).to.equal(0);
          done();
        });
      });
    });

    it('should create a transaction - withdraw with fee', function(done){
      Account.findById('53d01ddf4fbbd6de0b662202', function(err, account){
        account.transaction({type:'withdraw', pin:'9132', amount:'3000'}, function(err, transaction){
          console.log(transaction);
          expect(transaction.amount).to.equal(3000);
          expect(transaction.fee).to.equal(50);
          done();
        });
      });
    });
  });

});

