// API ROUTES -------------------
var express = require('express');
var apiRoutes = express.Router();
var User = require('../models/user'); // get our mongoose model
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var cookie = require('cookie');

// route to register user
apiRoutes.post('/register', function(req, res) {

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err)
            throw err;

        if (user) {
            res.json({success: false, message: 'Email already taken'});
        } else {

            var hash = bcrypt.hashSync(req.body.password, 10);

            // create a sample user
            var newUser = new User({email: req.body.email, password: hash, admin: false});

            // save the sample user
            newUser.save(function(err) {
                if (err)
                    throw err;

                // if xhr send json, otherwise send page?
                res.json({success: true, message: 'User saved successfully', xhrRequest: req.xhr});
            });
        }
    });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

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
                // create a token
                var token = jwt.sign(user, req.app.get('jakesappjwt'), {
                    expiresIn: '7d' // expires in 7 days
                });

                // return the information including token as JSON
                res.cookie('jake-auth-access-token', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    httpOnly: true
                });
                res.json({success: true, message: 'Enjoy your token!', token: token});
            }

        }

    });
});

// VERIFY TOKENS, NEEDS TO BE BEFORE AUTH PROTECTED API ROUTES
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies['jake-auth-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jakesappjwt'), function(err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({success: false, message: 'No token provided.'});

    }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({message: 'Welcome to the coolest API on earth!'});
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

module.exports = apiRoutes;
