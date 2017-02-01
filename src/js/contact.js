var $ = require('webpack-zepto');
module.exports = {
    init: function(){
        $('button').on('click', function() {
            var clientTemplate = require('../hbs/partials/clientTemplate.hbs');
            var context = {
                title: 'Client Template',
                message: 'This is a template loaded on the client'
            };
            $('.placeholder').html(clientTemplate(context));
        })
    }
}
