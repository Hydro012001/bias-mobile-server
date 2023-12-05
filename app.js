const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3006; // Change the port if needed
console.log(process.env.EMAIL_USERNAME)
console.log(process.env.EMAIL_PASSWORD)
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change this to your email service provider
  auth: {
    user: process.env.EMAIL_USERNAME,// Your email address
    pass: process.env.EMAIL_PASSWORD,// Your email password (make sure to use environment variables in production)
  },
});

// API endpoint to send verification email
app.get('/send-verification-email', async (req, res) => {
  const { email } = req.query; // Get the email from the query parameters

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a verification code

  const mailOptions = {
    from: 'biascapstone@gmail.com',
    to: email,
    subject: 'Verification Code for Your App',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).send('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending verification email');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
