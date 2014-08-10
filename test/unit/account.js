/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Account   = require('../../app/models/account');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');
var cp        = require('child_process');
var db        = 'tm-test';

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
      expect(a.transactions).to.have.length(0);
    });
  });

  describe('.create', function(){
    it('should save a new Account object', function(done){
      Account.create({name:'Rachel', color:'ff5050', photo:'http://www.npmjs.org', type:'checking', pin:'4563', balance:'1000', dateOpened:'04/15/2013'},function(err,account){
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        expect(account).to.be.instanceof(Account);
        expect(account.name).to.equal('Rachel');
        expect(account.photo).to.equal('http://www.npmjs.org');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a account by its id - as string', function(done){
      Account.findById('53d01ddf4fbbd6de0b662201', function(account){
        expect(account.name).to.equal('Audrey');
        expect(account).to.be.instanceof(Account);
        done();
      });
    });

    it('should find a account by its id - as object id', function(done){
      Account.findById(Mongo.ObjectID('53d01ddf4fbbd6de0b662203'), function(account){
        expect(account.name).to.equal('Natalie');
        expect(account).to.be.instanceof(Account);
        done();
      });
    });
  });

  describe('#transaction', function(){
    it('should process a transaction and save it to the array', function(done){
      var deposit = account.transaction(function(){
        
      });
      done();
    });
  });

//  describe('.query', function(){
//    it('should show accounts', function(done){
//      Account.query({}, function(err, accounts){
//        expect(accounts).to.have.length(4);
//        done();
//      });
//    });
//  });
});

