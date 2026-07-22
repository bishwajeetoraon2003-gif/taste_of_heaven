const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  // If SMTP environment variables are not provided, log simulated email
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.example.com') {
    logger.info(`[SIMULATED EMAIL] To: ${options.email} | Subject: ${options.subject} | Message: ${options.message}`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `Taste of Heaven Concierge <${process.env.FROM_EMAIL || 'concierge@tasteofheaven.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
