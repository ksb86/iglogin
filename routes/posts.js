var express = require('express');
var router = express.Router();

/* POST send-email. */
router.post('/send-email', function(req, res, next) {
    // var helper = require('sendgrid').mail;
    // var from_email = new helper.Email('test@example.com');
    // var to_email = new helper.Email('ksbarnwell@gmail.com');
    // var subject = 'Hello World from the SendGrid Node.js Library!';
    // var content = new helper.Content('text/plain', 'Hello, Email!');
    // var mail = new helper.Mail(from_email, subject, to_email, content);
    //
    // var sg = require('sendgrid')('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');
    // var request = sg.emptyRequest({
    //     method: 'POST',
    //     path: '/v3/mail/send',
    //     body: mail.toJSON(),
    // });
    //
    // sg.API(request, function(error, response) {
    //     console.log(response);
    //     res.render('pages/contact', {
    //         pageTitle: 'Email Sent',
    //         status: response.statusCode,
    //         body: response.body,
    //         headers: response.headers
    //     });
    // });






    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shane.rasp.pi@gmail.com',
            pass: 'Kevin!23'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'shane.rasp.pi@gmail.com', // sender address
        to: 'ksbarnwell@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.render('pages/contact', {
            pageTitle: 'Email Sent',
            messageId: info.messageId,
            response: info.response
        });
    });





});

module.exports = router;
