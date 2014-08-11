'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('express-method-override');
var home = require('../controllers/home');
var accounts = require('../controllers/accounts');
var transfers = require('../controllers/transfers');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);
  app.get('/contact', home.contact);

  app.get('/accounts/new', accounts.init);
  app.post('/accounts', accounts.create);
  app.get('/accounts', accounts.index);

  app.get('/transfers/new', transfers.init);
  app.post('/transfers', transfers.create);
  app.get('/transfers', transfers.index);

  console.log('Pipeline Configured');
};
