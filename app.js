var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var mongoose = require('mongoose');
var config = require('./config'); // fixme (include only in dev, use env variables in prod)
mongoose.connect(config.mongoDatabaseUrl); // connect to database

var pageRoutes = require('./routes/pageRoutes');

var app = express();
app.set('appSecret', config.appSecret); // secret variable

// set views location (src/hbs)
app.set('views', path.join(__dirname, 'src/hbs'));
app.set('view engine', 'hbs');
// set partials location (src/partials)
hbs.registerPartials(__dirname + '/src/hbs/partials');
// set layout/template location based on env
var mainTemplate = 'layout';
if (process.env.NODE_ENV === 'dev') {
    mainTemplate = 'layoutdev';
}
app.set('view options', {
    layout: mainTemplate
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

module.exports = app;
