var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        pageTitle: 'Home Page',
        pageName: 'home'
    });
});
/* GET list page. */
router.get('/list', function(req, res, next) {
    res.render('list', {
        pageTitle: 'List Page',
        pageName: 'list'
    });
});
/* GET account page. */
router.get('/account', function(req, res, next) {
    res.render('account', {
        pageTitle: 'Account Page',
        pageName: 'account'
    });
});
/* GET settings page. */
router.get('/settings', function(req, res, next) {
    res.render('settings', {
        pageTitle: 'Settings Page',
        pageName: 'settings'
    });
});
/* GET help page. */
router.get('/help', function(req, res, next) {
    res.render('help', {
        pageTitle: 'Help Page',
        pageName: 'help'
    });
});
/* GET about page. */
router.get('/about', function(req, res, next) {
    res.render('about', {
        pageTitle: 'About Page',
        pageName: 'about'
    });
});

module.exports = router;
