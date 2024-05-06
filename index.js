const express = require('express');
const app = express();
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

dotenv.config(); // Load environment variables
app.use(express.json());

const pool = require('./config/db'); // Import the connection pool

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS for secure communication
  auth: {
    user: 'sachinsakh108@gmail.com',  // Use environment variable
    pass: 'erxm yrpp awyf dctm', // Use environment variable
  }
});

const sendEmail = async (senderEmail, recipientEmails, subject, text) => {
  try {
    const mailOptions = {
      from: senderEmail,
      cc: recipientEmails.join(', '), // Join email addresses with comma and space
      subject: subject,
      html: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    // Implement additional error handling (e.g., retry, notify admin)
  }
};

// Improved route to test database connection and fetch data
app.post('/', async (req, res) => {
  try {
    const connection = await pool.getConnection(); // Create a connection

    // Test connection (optional)
    const testResult = await connection.query('SELECT 1');
    if (!testResult) {
      throw new Error('Database connection failed'); // Handle connection error
    }

    console.log('Database connection successful');

    const data = await connection.query('SELECT * FROM userdata');
    if (!data.length) {
      // Improved error handling with specific message
      res.status(200).send({ success: true, message: 'No user data found', data: [] });
    } else {
      res.status(200).send({ success: true, message: 'Data retrieved successfully'});
    }

    connection.release(); // Release the connection
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error fetching data' }); // Handle errors gracefully
  }
});

// Schedule email sending every 10 minutes
const emailSendingJob = schedule.scheduleJob('*/1 * * * *', async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM userdata');
    connection.release();

    if (!rows.length) {
      console.log('No email data found in database');
      return; // Exit if no data found
    }

    const senderEmail = rows[0].sender_email;
    const recipientEmails = [rows[0].L1_Mail]; // L1_Mail as main recipient
    const ccEmails = [rows[0].L2_Mail, rows[0].L3_Mail, rows[0].L4_Mail].filter(email => email); // Filter out empty email addresses
    const currentTime = Date.now();
    const dateObject = new Date(currentTime);
    const timestamp = dateObject.toLocaleString(); // Format timestamp for readability
    const subject = 'Test Email'; // Replace with your desired subject
    const text = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #007bff;">Scheduled Email</h2>
    <p>This is a scheduled email.</p>
    <p>Current time: <strong>${timestamp}</strong></p>
    <p>Regards,<br>Remote Data Exchange</p>
  </div>
    `; // Replace with your email content

    await sendEmail(senderEmail, recipientEmails.concat(ccEmails), subject, text);
  } catch (error) {
    console.error('Error sending email:', error);
    // Implement additional error handling (e.g., retry, notify admin)
  }
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
