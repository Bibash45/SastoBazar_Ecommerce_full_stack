// emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code from SastoBazaar",
    html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 2px solid #4CAF50;
              }
              .header h1 {
                color: #4CAF50;
              }
              .content {
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #777;
              }
              .code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to SastoBazaar!</h1>
              </div>
              <div class="content">
                <p>Thank you for registering with us! To complete your registration, please use the verification code below:</p>
                <p class="code">${code}</p>
                <p>This code is valid for a limited time only. Please enter it in the application to verify your account.</p>
              </div>
              <div class="footer">
                <p>Thank you for choosing SastoBazaar!</p>
                <p>If you did not register for an account, please ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};
