const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

/* =======================
   Middleware
======================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   Serve static frontend
======================= */
app.use(express.static(__dirname));

app.get('/photos.json', (req, res) => {
  res.type('json');
  res.sendFile(path.join(__dirname, 'photos.json'));
});

/* =======================
   Nodemailer config
======================= */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =======================
   Contact form API
======================= */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><small>Sent from portfolio website</small></p>
      `
    });

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

/* =======================
   SPA fallback
======================= */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* =======================
   Start server (ONLY ONCE)
======================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
