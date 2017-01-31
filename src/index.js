/* CSS */
require('./index.less');
/* CSS */

var $ = require('jquery');
var contact = require('./js/contact');

$(document).ready(function() {
    console.log('dom ready');
    contact.init();
});
