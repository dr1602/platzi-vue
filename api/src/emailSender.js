// emailSender.js
const sgMail = require('@sendgrid/mail');

// Configura tu API Key de SendGrid
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail(to, subject, text) {
  try {
    const msg = {
      to,
      from: 'no-reply@certiblocks.io',
      subject,
      text,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { sendEmail };