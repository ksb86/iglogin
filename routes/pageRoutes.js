var express = require('express');
var pageRouter = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var cookie = require('cookie');
var bcrypt = require('bcrypt');
var User = require('../models/user'); // get our mongoose model
var instagramNode = require('instagram-node').instagram();
var INSTAGRAM_CLIENT_ID = "7814efbb6acd4d09a4ce7109f5e389b5"
var INSTAGRAM_CLIENT_SECRET = "738a7ca282e04a4fa47984625618ff11";

instagramNode.use({client_id: INSTAGRAM_CLIENT_ID, client_secret: INSTAGRAM_CLIENT_SECRET});

var redirect_uri = 'http://localhost:3000/igLoginReturn'; // fixme

var doLogin = function(user, req, res) {
    // create a token from user info
    var token = jwt.sign(user, req.app.get('jakesappjwt'), {
        expiresIn: '7d' // expires in 7 days
    });
    // return the information including token as JSON
    res.cookie('jake-auth-access-token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
    });
    res.redirect('/account');


    // // IF NEW USER, STORE IN DATABASE HERE.. //fixme
    // // MAKE TOKEN
    // var token = jwt.sign(result, req.app.get('jakesappjwt'), {
    //     expiresIn: '7d' // expires in 7 days
    // });
    // // STORE TOKEN IN COOKIE
    // res.cookie('jake-auth-access-token', token, {
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //     httpOnly: true
    // });
    // res.redirect('/account');

    // res.json({success: true, message: 'Enjoy your token!'});
};

/* Check all for auth */
// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
pageRouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['jake-auth-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jakesappjwt'), function(err, decoded) {
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

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err)
            throw err;

        if (user) {
            res.json({success: false, message: 'Email already taken'});
        } else {
            console.log('req.body: ', req.body);
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

/* post to custom login */
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
pageRouter.post('/igLogin', function(req, res) {
    res.redirect(instagramNode.get_authorization_url(redirect_uri, {
        state: 'a state', // fixme,
        scope: 'likes+comments+follower_list' // fixme,
    }));
});

/* instagram login callback */
pageRouter.get('/igLoginReturn', function(req, res) {
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
    console.log(req.user);
    res.render('pages/index', {
        pageTitle: 'Express Template',
        user: req.user
    });
});

/* GET gallery page. */
pageRouter.get('/login', function(req, res, next) {
    if (req.user) {
        res.redirect('/account');
    }
    res.render('pages/login', {
        pageTitle: 'Login Page',
        user: req.user
    });
});

/* GET account page. */
pageRouter.get('/account', function(req, res, next) {
    res.render('pages/account', {
        pageTitle: 'Account Page',
        user: req.user
    });
});

/* GET logout page. */
pageRouter.get('/logout', function(req, res, next) {
    res.cookie('jake-auth-access-token', {expires: Date.now()});
    res.clearCookie('jake-auth-access-token');
    res.redirect('/');
});

// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
pageRouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['jake-auth-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jakesappjwt'), function(err, decoded) {
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



/* GET protected page. */
pageRouter.get('/protected', function(req, res, next) {

    res.render('pages/protected', {
        pageTitle: 'protected Page',
        user: req.user
    });
});

module.exports = pageRouter;
