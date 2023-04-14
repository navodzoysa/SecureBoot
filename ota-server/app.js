var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
require('./db/conn');

const rateLimiter = rateLimit({
  windowMs: 10000,
  max: 20,
});

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var firmwareRouter = require('./routes/firmware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());
app.use(rateLimiter);
app.use(express.static(path.join(__dirname, '../ui/build')));

// app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/firmware', firmwareRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
