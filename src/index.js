/* CSS */
require("bootstrap/dist/css/bootstrap.css");
require('./index.less');
/* CSS */

var $ = require('webpack-zepto');
var contact = require('./js/contact');

$(document).ready(function() {
    console.log('dom ready');
    contact.init();
});
