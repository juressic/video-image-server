const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('./config');

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken });

const send_mail = (name, link, recepient) => {
  const accessToken = OAuth2_client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      accessToken: accessToken,
    },
  });

  const mail_options = {
    from: `JURE <${config.user}>`,
    to: recepient,
    subject: 'A Message from virualant',
    html: get_html_message(name, link),
  };

  transport.sendMail(mail_options, (error, result) => {
    console.log('sending mail');
    if (error) {
      console.log('Error: ', error);
    } else {
      console.log('Success: ', result);
    }
    transport.close();
    process.exit(1);
  });
};

function get_html_message(name, link) {
  return `
    <h3>${name}! Hey, thanks for visiting</h3>
    <h2> Hey, here is link for your web page: http://${link} </h2>
    `;
}

module.exports = send_mail;
