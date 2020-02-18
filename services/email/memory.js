const { loadTemplate } = require('../../helpers/templateLoader');
const { EMAIL_FROM_ADDR } = require('../../config');

const outbox = [];

module.exports = {
  sendTemplate: async (templateName, subject, toEmail, params) => {
    const content = await loadTemplate(templateName, params);
    outbox.push(
      {
        meta: params,
        email: {
          from: EMAIL_FROM_ADDR,
          to: toEmail,
          subject,
          text: content,
          html: content,
        },
      },
    );
    const info = {};
    Promise.resolve(info);
  },
  outbox,
};
