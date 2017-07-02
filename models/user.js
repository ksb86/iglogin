// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        sparse: true
    },
    username: String,
    password: String,
    admin: Boolean,
    instagramId: String
}, {strict: true});
userSchema.index({
    email: 1
}, {
    unique: true,
    index: true,
    sparse: true
}); // schema level

module.exports = mongoose.model('User', userSchema, 'igloginUsers');
