'use strict';

var Account = require('../models/account');
var moment = require('moment');
var taskHelper = require('../helpers/task_helper');

exports.init = function(req, res){
  Account.all(function(err, priorities){
    res.render('accounts/init', {priorities:priorities});
  });
};

exports.create = function(req, res){
  Account.create(req.body, function(){
    res.redirect('/accounts');
  });
};

exports.index = function(req, res){
  Account.query(req.query, function(err, tasks){
    Account.count(req.query, function(err, count){
      res.render('accounts/index', {accounts:accounts, moment:moment, taskHelper:taskHelper, count:count, query:req.query});
    });
  });
};

