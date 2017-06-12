/* CSS */
require("bootstrap/dist/css/bootstrap.css");
require('./index.less');
/* CSS */

var $ = require('webpack-zepto');
var contact = require('./js/contact');
var login = require('./js/login');

$(document).ready(function() {
    console.log('dom ready');
    contact.init();
    login.init();
});
