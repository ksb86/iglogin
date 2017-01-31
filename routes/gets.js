var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', {
        pageTitle: 'Express Template'
    });
});

/* GET gallery page. */
router.get('/gallery', function(req, res, next) {
    res.render('pages/gallery', {
        pageTitle: 'Gallery Page'
    });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
    res.render('pages/contact', {
        pageTitle: 'Contact Page'
    });
});

module.exports = router;
