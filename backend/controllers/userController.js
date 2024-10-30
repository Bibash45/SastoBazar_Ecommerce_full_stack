import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { OAuth2Client } from "google-auth-library";

// @desc    Auth user & get token
// @route   POST/api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
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
    res.status(400);
    throw new Error("User already exists");
  }

  // Generate a random 6-digit code for email verification
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Set verification code expiration to 10 minutes from now
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Send verification email
  await sendVerificationEmail(email, verificationCode);

  // Create the user with a pending verification status
  const user = await User.create({
    name,
    email,
    password,
    verificationCode, // Store the generated code
    verificationCodeExpires, // Set expiration time
    isVerified: false, // Initially not verified
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
  const users = await User.find({});
  res.status(200).json(users);
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
    console.log("Received idToken:", token);
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Find or create the user based on the Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
      });
    }

    // Generate JWT for the user
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
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
};
