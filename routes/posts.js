var express = require('express');
var router = express.Router();
// var nodemailer = require('nodemailer');

/* POST send-email. */
router.post('/send-email', function(req, res, next) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shane.rasp.pi',
            pass: 'Kevin!23'
        }
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: 'shane.rasp.pi@gmail.com', // sender address
        to: 'ksbarnwell@gmail.com', // list of receivers
        subject: 'Test', // Subject line
        text: 'Test', // plain text body
        html: '<b>Testing</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log(info);
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.render('pages/contact', {
            pageTitle: 'Email Sent',
            messageId: info.messageId,
            response: info.response
        });
    });
});

module.exports = router;
