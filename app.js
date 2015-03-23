var express = require('express');
var path = require('path');
var mongoose = module.exports = require('mongoose');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var fs = require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
fs.readdirSync(__dirname + '/models/').forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + '/models/'+filename);
});

app.use('/', routes);
//app.use('/users', users);
app.get('/users', function(req, res) {
  //res.send('respond with a resource');
  //var mongoose = req.mongoose;
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    mongoose.connect('mongodb://localhost:27017/expresshogan_mongoose');
}
//mongoose.model('users',{name:String});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // Make our db accessible to our router
    req.mongoose = mongoose;
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
