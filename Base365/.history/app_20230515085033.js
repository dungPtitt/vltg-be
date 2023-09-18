var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var candidateRouter = require('./routes/timviec/candidate');
var companyRouter = require('./routes/timviec/company');
var cvRouter = require('./routes/timviec/cv');
var donRouter = require('./routes/timviec/don');
var thuRouter = require('./routes/timviec/thu');
var sllRouter = require('./routes/timviec/syll');
var toolAddDataRouter = require('./routes/tools');

var app = express();
//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/timviec/candidate', candidateRouter);
app.use('/api/timviec/company', companyRouter);
app.use('/api/timviec/cv', cvRouter);
app.use('/api/timviec/don', donRouter);
app.use('/api/timviec/thu', thuRouter);

app.use('/api/tool', toolAddDataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const DB_URL = 'mongodb://127.0.0.1/timviec365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

module.exports = app;