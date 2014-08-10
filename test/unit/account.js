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
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Account object', function(){
      var o = {name:'Dishes', due:'3/11/2004', photo:'d1.jpg', tags:'a,b,c', priorityId:'53d01ddf4fbbd6de0b530014'};
      var t = new Account(o);
      expect(t).to.be.instanceof(Account);
      expect(t.name).to.equal('Dishes');
      expect(t.due).to.be.instanceof(Date);
      expect(t.photo).to.equal('d1.jpg');
      expect(t.isComplete).to.be.false;
      expect(t.tags).to.have.length(3);
      expect(t.priorityId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should save a new Account object', function(done){
      Account.create({name:'Dishes', due:'3/11/2004', photo:'d1.jpg', tags:'a,b,c', priorityId:'53d01ddf4fbbd6de0b530014'}, function(err, task){
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        expect(account).to.be.instanceof(Account);
        expect(account.name).to.equal('Dishes');
        expect(account.due).to.be.instanceof(Date);
        expect(account.photo).to.equal('d1.jpg');
        expect(account.isComplete).to.be.false;
        expect(account.tags).to.have.length(3);
        expect(account.priorityId).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a account by its id - as string', function(done){
      Account.findById('53d01ddf4fbbd6de0b530020', function(account){
        expect(account.name).to.equal('Gas');
        expect(account).to.be.instanceof(Account);
        done();
      });
    });

    it('should find a account by its id - as object id', function(done){
      Account.findById(Mongo.ObjectID('53d01ddf4fbbd6de0b530020'), function(account){
        expect(account.name).to.equal('Gas');
        expect(account).to.be.instanceof(Account);
        done();
      });
    });
  });

  describe('#toggle', function(){
    it('should toggle a account from not complete to complete', function(done){
      Account.findById('53d01ddf4fbbd6de0b530021', function(account){
        account.toggle(function(){
          Account.findById('53d01ddf4fbbd6de0b530021', function(account){
            expect(account.isComplete).to.be.true;
            done();
          });
        });
      });
    });
  });

  describe('.query', function(){
    it('should show top 3 accounts', function(done){
      Account.query({}, function(err, accounts){
        expect(accounts).to.have.length(3);
        expect(accounts[0].priority.name).to.be.ok;
        done();
      });
    });
  });
});

