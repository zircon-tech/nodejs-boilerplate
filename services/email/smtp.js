const nodemailer = require('nodemailer');
const { EMAIL_ACCOUNT, EMAIL_SECRET, EMAIL_FROM_ADDR } = require('../../config');
const { loadTemplate } = require('../../helpers/templateLoader');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_SECRET,
  },
});

module.exports = {
  sendTemplate: (templateName, subject, toEmail, params) => loadTemplate(templateName, params)
    .then((content) => new Promise((resolve, reject) => {
      transporter.sendMail({
        from: EMAIL_FROM_ADDR,
        to: toEmail,
        subject,
        text: content,
        html: content,
      }, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    })),
};
