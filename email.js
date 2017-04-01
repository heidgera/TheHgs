//////////////////////////////////////////////////////////////////

//Email

var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

exports.sendEmail = function(rcpt, subj, body) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: '212.Bedford@gmail.com',
        clientId: '400886171766-a61l3umu0j64a15ngp0mfa2161bnmeuu.apps.googleusercontent.com',
        clientSecret: '_sQi4bAhovm_lj0fZ4DBxJPe',
        refreshToken: '1/FxrklZpGyam-qjH1xjtLXL22dCcxOmMDzCymdzcQMlAMEudVrK5jSpoR30zcRFq6',
      }),
    },
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '212.Bedford@gmail.com', // sender address
    to: rcpt, // list of receivers
    subject: subj, // Subject line
    text: body, // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }

    console.log('Message sent: ' + info.response);
  });
};

//////////////////////////////////////////////////////////////////
