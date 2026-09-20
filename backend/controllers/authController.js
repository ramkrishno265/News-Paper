const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ১. প্রথমে jwt ইমপোর্ট করুন

// 1. Register Logic
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Please login.' 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// 2. Login Logic
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ইউজার ডাটাবেজে আছে কি না চেক করা
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    // পাসওয়ার্ড ম্যাচ করছে কি না চেক করা
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    // ২. আসল রিয়েল JWT টোকেন তৈরি করা (৩০ দিনের জন্য ভ্যালিড)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // সফলভাবে লগইন হলে টোকেন সহ রেসপন্স পাঠানো
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token, // রিয়েল টোকেন এখানে পাস করা হলো
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };