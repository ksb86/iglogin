var express = require('express');
var pageRouter = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var cookie = require('cookie');
var bcrypt = require('bcrypt');
var User = require('../models/user'); // get our mongoose model
var instagramNode = require('instagram-node').instagram();
var config = require('../config'); // fixme (include only in dev, use env variables in prod)

instagramNode.use({client_id: config.igClientId, client_secret: config.igClientSecret});

var redirect_uri = 'http://localhost:8080/igloginreturn'; // fixme

var doLogin = function(user, req, res) {
    // create a token from user info
    var token = jwt.sign(user, req.app.get('appSecret'), {
        expiresIn: '7d' // expires in 7 days
    });
    // return the information including token as JSON
    res.cookie('iglogin-auth-access-token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
    });
    res.redirect('/account');

    // IF NEW USER, STORE IN DATABASE HERE.. // fixme
    // IF EXISING USER GET DATA BASED IN IG ID // fixme
};

// Check every request for cookie for displaying username
pageRouter.use(function(req, res, next) {

    // check cookies for token
    var token = req.cookies['iglogin-auth-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get('appSecret'), function(err, decoded) {
            if (err) {
                next()
            } else {
                console.log('decoded: ', decoded);
                req.user = decoded.username;
                next();
            }
        });
    } else {
        next();
    }
});

// route to register user
pageRouter.post('/register', function(req, res) {

    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err)
            throw err;

        if (user) {
            res.json({success: false, message: 'Email already taken'});
        } else {
            var hash = bcrypt.hashSync(req.body.password, 10);

            // create user (need to store user data in variable first to send to token)
            var userData = {email: req.body.email, password: hash, admin: false, username: req.body.email};
            var newUser = new User(userData);

            // save the sample user
            newUser.save(function(err) {
                if (err)
                    throw err;
                // login
                doLogin(userData, req, res);
            });
        }
    });
});

// route to checkou login request
pageRouter.post('/login', function(req, res) {

    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err)
            throw err;

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                // if user is found and password is right
                doLogin(user._doc, req, res);
            }
        }
    });
});

/* post to instagram login */
pageRouter.post('/iglogin', function(req, res) {
    res.redirect(instagramNode.get_authorization_url(redirect_uri, {
        state: 'a state', // fixme,
        scope: 'likes+comments+follower_list' // fixme,
    }));
});

/* instagram login callback */
pageRouter.get('/igloginreturn', function(req, res) {
    instagramNode.authorize_user(req.query.code, redirect_uri, function(err, result) {
        if (err) {
            console.log('err: ', err);
            res.redirect('/');
        } else {
            console.log('result: ', result);

            User.findOne({
                instagramId: result.user.id
            }, function(err, user) {
                if (err)
                    throw err;

                if (user) {
                    // user exists, login
                    doLogin(result.user, req, res);
                } else {
                    // user does not exist, create and login

                    // create user (need to store user data in variable first to send to token)
                    var userData = {
                        admin: false,
                        username: result.user.username,
                        instagramId: result.user.id
                    };

                    var newUser = new User(userData);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // login
                        doLogin(userData, req, res);
                    });
                }
            });
        }
    });
});


/* GET home page. */
pageRouter.get('/', function(req, res, next) {
    res.render('pages/index', {
        pageTitle: 'Express Template',
        pageName: 'home',
        user: req.user
    });
});

/* GET login page. */
pageRouter.get('/login', function(req, res, next) {
    if (req.user) {
        res.redirect('/account');
    }
    res.render('pages/login', {
        pageTitle: 'Login Page',
        pageName: 'login'
    });
});

/* GET logout page. */
pageRouter.get('/logout', function(req, res, next) {
    res.cookie('iglogin-auth-access-token', {expires: Date.now()});
    res.clearCookie('iglogin-auth-access-token');
    res.redirect('/');
});

// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
// routes after this will be restricted to logged in users
pageRouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['iglogin-auth-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('appSecret'), function(err, decoded) {
            if (err) {
                return res.redirect('/login');
                console.log('No token provided.');
                // return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.redirect('/login');
        console.log('No token provided.');
        //
        // // if there is no token
        // // return an error
        // return res.status(403).send({success: false, message: 'No token provided.'});

    }
});

/* GET account page. */
pageRouter.get('/account', function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    }
    res.render('pages/account', {
        pageTitle: 'Account Page',
        pageName: 'account',
        user: req.user
    });
});

/* GET protected page. */
pageRouter.get('/protected', function(req, res, next) {

    res.render('pages/protected', {
        pageTitle: 'protected Page',
        pageName: 'protected',
        user: req.user
    });
});

module.exports = pageRouter;
