/*
* Manage app with express
*/
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    config = require('config'),
    app = express();

// view engine setup
app.engine('html', require("ejs").renderFile);
app.set('views', path.join(__dirname, config.get('VIEWDIR')));
app.set('view engine', 'html');

// app path and body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, config.get('PUBLICDIR'))));
app.use(express.static(path.join(__dirname, config.get('SOCKETDIR'))));
// app session 
app.use(session({
    secret: 'chatapp',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: config.get('MONGODB')})
}));

// router manage
app.use('*',function (req, res, next) {
    req.io = global.io;
    req.socket = global.socket;
    next()
});
app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
