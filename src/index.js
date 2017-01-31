/* CSS */
require('./index.less');
/* CSS */

var $ = require('jquery');
var test = require('./js/test');

$(document).ready(function() {
    console.log('dom ready!');
    test.init();
});
