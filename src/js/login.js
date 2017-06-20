var $ = require('webpack-zepto');


var bindCreateForm = function() {
    $('.create-form').on('submit', function(e) {
        e.preventDefault();
        var email = $('.create-form [type=email]').val();
        var password = $('.create-form [type=password]').val();

        $.ajax({
            type: 'POST',
            url: '/api/register',
            data: {
                email: email,
                password: password
            },
            success: function(data, status, xhr){
                $('.create-form .result').text(data.success + ': ' + data.message);
            },
            error: function(xhr, errorType, error) {
                $('.create-form .result').text(data.success + ': ' + data.message);
            }
        });
    });
};
var bindLoginForm = function() {
    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        var email = $('.login-form [type=email]').val();
        var password = $('.login-form [type=password]').val();

        $.ajax({
            type: 'POST',
            url: '/api/authenticate',
            data: {
                email: email,
                password: password
            },
            success: function(data, status, xhr){
                $('.login-form .result').text(data.success + ': ' + data.message);
                if (data.success) {
                    document.location.href = '/';
                }
            },
            error: function(xhr, errorType, error) {
                $('.login-form .result').text(data.success + ': ' + data.message);
            }
        });
    });
};

module.exports = {
    init: function(){
        // bindCreateForm();
        // bindLoginForm();
    }
};
