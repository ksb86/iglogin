/* CSS */
require('./index.less');
/* CSS */

var $ = require('jquery');
var test = require('./js/test');
var clientTemplate = require('./hbs/clientTemplate.hbs');

$(document).ready(function() {
    console.log('dom ready!');
    var context = {
        title: 'Client Template',
        message: 'This is a template loaded on the client'
    };
    $('.page-home .content').html(clientTemplate(context));
    // $('body').html(nav());
    test.init();
});
