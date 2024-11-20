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
    from: `Sasto Bazar - ${process.env.EMAIL_USER}`,
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
  transporter.sendMail(
    {
      from: "your-email@gmail.com",
      to: "recipient-email@example.com",
      subject: "Test Email",
      text: "This is a test email sent from Nodemailer.",
    },
    (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    }
  );

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Function to send reset password email
export const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: `Sasto Bazar - ${process.env.EMAIL_USER}`,
    to: email,
    subject: "Password Reset Request from SastoBazaar",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; }
          .header { text-align: center; padding: 10px 0; border-bottom: 2px solid #FF5733; }
          .header h1 { color: #FF5733; }
          .content { margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
          .button { display: inline-block; padding: 10px 15px; font-size: 16px; color: white; background-color: #FF5733; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password for your SastoBazaar account.</p>
            <p>If you made this request, please click the button below to reset your password:</p>
            <p><a href="${resetLink}" class="button">Reset Password</a></p>
            <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Thank you for using SastoBazaar!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// sending delivered email to customer
export const sendOrderDeliveredEmail = async (email, order) => {
  const mailOptions = {
    from: `Sasto Bazar - ${process.env.EMAIL_USER}`,
    to: email,
    subject: "Your Order Has Been Delivered - SastoBazaar",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; }
          .header { text-align: center; padding: 10px 0; border-bottom: 2px solid #28a745; }
          .header h1 { color: #28a745; }
          .content { margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
          .button { display: inline-block; padding: 10px 15px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px; }
          .order-details { margin-top: 15px; }
          .order-item { display: flex; align-items: center; margin-bottom: 15px; }
          .item-info { margin-left: 15px; }
          .item-info p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Been Delivered!</h1>
          </div>
          <div class="content">
            <p>Hello ${order.user.name},</p>
            <p>We're pleased to inform you that your order with SastoBazaar has been successfully delivered!</p>

            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</p>

              <h3>Items Delivered:</h3>
              ${order.orderItems
                .map(
                  (item) => `
                <div class="order-item">
                  <img src="../../${item.image}" alt="${item.name}" width="50" height="50">
                  <div class="item-info">
                    <p><strong>Product:</strong> ${item.name}</p>
                    <p><strong>Quantity:</strong> ${item.qty}</p>
                    <p><strong>Price:</strong> $${item.price}</p>
                  </div>
                </div>
              `
                )
                .join("")}
              
              <h3>Shipping Address:</h3>
              <p>${order.shippingAddress.address}, ${
      order.shippingAddress.city
    }</p>
              <p>${order.shippingAddress.country}, ${
      order.shippingAddress.postalCode
    }</p>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>Thank you for shopping with SastoBazaar!</p>
            <p><a href="https://www.sastobazaar.com" class="button">Visit SastoBazaar</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order delivered email sent");
  } catch (error) {
    console.error("Error sending order delivered email:", error);
    throw new Error("Failed to send order delivered email");
  }
};
