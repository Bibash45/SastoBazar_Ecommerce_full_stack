import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/emailService.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// @desc    Auth user & get token
// @route   POST/api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("auth");

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(400);
      throw new Error("Email not verified");
    }
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    next();
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register user
// @route   POST/api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(200).json({
      message:
        "User already exist , please complete verification step to continue",
    });
    return; // Stop further execution
  }

  // Generate a random 6-digit code for email verification
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await sendVerificationEmail(email, verificationCode);

  const user = await User.create({
    name,
    email,
    password,
    verificationCode,
    verificationCodeExpires,
    isVerified: false,
  });

  if (user) {
    res.status(201).json({
      message:
        "Verification code sent to email. Complete registration by verifying the code.",
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Verify user code
// @route   POST/api/users/verify-code
// @access  Public
const verifyUserCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (user.verificationCode !== code) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  // Check if the code has expired
  if (user.verificationCodeExpires < Date.now()) {
    res.status(400);
    throw new Error("Verification code has expired");
  }

  // If everything is valid, mark user as verified
  user.isVerified = true;
  user.verificationCode = null; // Clear the verification code after verification
  user.verificationCodeExpires = null; // Clear the expiration date
  await user.save();

  generateToken(res, user._id);

  res.status(200).json({
    message: "User verified and registered successfully.",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc  Logout user / clear cookie
// @route   POST/api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logout sucessfully",
  });
});

// @desc  Get user profile
// @route   GET/api/users/profile
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id,
  }).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc  Update user profile
// @route   PUT/api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("user profile");

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc  Get user
// @route   GET/api/users
// @access  Public/Admin

const getUsers = asyncHandler(async (req, res) => {
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = process.env.PAGINATION_LIMIT || 8; // Number of users per page

  // Keyword for name or email search
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } }, // Search by name
          { email: { $regex: req.query.keyword, $options: "i" } }, // Search by email
        ],
      }
    : {};

  // Count total users matching the search criteria
  const count = await User.countDocuments({ ...keyword });

  // Fetch users with pagination and filtering
  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));

  res.status(200).json({
    users,
    page: pageNumber,
    pages: Math.ceil(count / pageSize), // Total number of pages
  });
});

// @desc  Get user by ID
// @route   GET/api/users/:id
// @access  Public/Admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE/api/users/:id
// @access  Public/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({
      _id: user._id,
    });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT/api/users/:id
// @access  Public/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure you are using your Google Client ID here
    });

    const payload = ticket.getPayload(); // Retrieve the payload (user data)

    console.log(payload);

    if (!payload) {
      return res.status(400).json({
        error: "Google login failed. No payload received.",
      });
    }

    const { email_verified, email, name } = payload;

    // Log the Google payload for debugging purposes (optional)
    console.log("Google Payload:", payload);

    // Check if email is verified by Google
    if (!email_verified) {
      return res.status(400).json({
        error: "Google login failed. Email not verified.",
      });
    }

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate a new JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Respond with token and user data
      return res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      // User does not exist, create a new user
      const password = email + process.env.JWT_SECRET; // Use email + secret as a temporary password
      user = new User({
        name,
        email,
        password,
        isVerified: true, // Google account should be considered verified
      });

      // Save the new user to the database
      const savedUser = await user.save();

      // Generate a new JWT token for the new user
      const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Respond with the token and user data
      return res.json({
        token,
        user: {
          _id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.isAdmin ? "Admin" : "User", // Example: Add roles
        },
      });
    }
  } catch (err) {
    console.log("ERROR GOOGLE LOGIN", err);
    return res.status(400).json({
      error: "Failed to authenticate user. Please try again.",
    });
  }
});

// @desc    Resend verification code
// @route   POST /api/users/resend-verify-code
// @access  Public
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  // Generate a new 6-digit code for email verification
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Send verification email
  await sendVerificationEmail(email, verificationCode);

  // Update user with new verification code and expiration time
  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;
  await user.save();

  res.status(200).json({ message: "Verification code sent to email" });
});

// @desc    Forgot Password - Send reset password email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate a reset token and expiration time
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

  // Set token and expiration in the user model
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpires;
  await user.save();

  // Generate reset password link
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send reset password email
  await sendResetPasswordEmail(email, resetLink);

  res.status(200).json({ message: "Password reset email sent" });
});

// @desc    Reset Password - Update user password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  // Decode token and find user
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: decoded.id,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Ensure token hasn't expired
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  // Hash new password and save it to user
  user.password = password;
  // user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null; // Clear reset token
  user.resetPasswordExpires = null; // Clear token expiration
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

const totalUser = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Get total orders count
    res.status(200).json({ totalUsers }); // Send response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

export {
  authUser,
  registerUser,
  verifyUserCode,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  googleLogin,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  totalUser,
};
