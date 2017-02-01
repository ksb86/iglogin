var express = require('express');
var router = express.Router();

/* POST send-email. */
router.post('/send-email', function(req, res, next) {
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('test@example.com');
    var to_email = new helper.Email('ksbarnwell@gmail.com');
    var subject = 'Hello World from the SendGrid Node.js Library!';
    var content = new helper.Content('text/plain', 'Hello, Email!');
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        res.render('pages/contact', {
            pageTitle: 'Email Sent',
            status: response.statusCode,
            body: response.body,
            headers: response.headers
        });
    });
});

module.exports = router;
