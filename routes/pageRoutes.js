var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var cookie = require('cookie');


/* Check all for auth */
// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['jake-auth-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jakesappjwt'), function(err, decoded) {
            if (err) {
                next()
            } else {
                req.user = decoded.user.username;
                next();
            }
        });
    } else {
        next();
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('pages/index', {
        pageTitle: 'Express Template',
        user: req.user
    });
});

/* GET gallery page. */
router.get('/login', function(req, res, next) {
    res.render('pages/login', {
        pageTitle: 'Login Page',
        loggedIn: req.userLoggedIn
    });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
    res.render('pages/contact', {
        pageTitle: 'Contact Page',
        loggedIn: req.userLoggedIn
    });
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
    res.cookie('jake-auth-access-token', {expires: Date.now()});
    res.clearCookie('jake-auth-access-token');
    res.render('pages/index', {
        pageTitle: 'Express Template'
    });
    // no need to put loggedIn here since the check was done before clearing cookies.
});

// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['jake-auth-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jakesappjwt'), function(err, decoded) {
            if (err) {
                return res.render('pages/unauthorized', {
                    pageTitle: 'Contact Page',
                    message: 'No token provided.'
                });
                // return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.render('pages/unauthorized', {
            pageTitle: 'Contact Page',
            message: 'No token provided.'
        });
        //
        // // if there is no token
        // // return an error
        // return res.status(403).send({success: false, message: 'No token provided.'});

    }
});



/* GET protected page. */
router.get('/protected', function(req, res, next) {

    res.render('pages/protected', {
        pageTitle: 'protected Page',
        loggedIn: req.userLoggedIn
    });
});

module.exports = router;
