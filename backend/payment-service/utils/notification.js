const nodemailer = require('nodemailer');
const twilio = require('twilio');
require("dotenv").config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Email sender
exports.sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('✅ Email sent successfully to', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// SMS sender
exports.sendSMS = async (to, message) => {
  try {
    const sms = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log('✅ SMS sent successfully to', to);
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
  }
};
