require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/database');

async function setPasswordForUser() {
  try {
    await connectDB();
    
    // Find the atharva_shah user (the one with Google OAuth)
    const user = await User.findOne({ username: 'atharva_shah' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Found user:', user.username, user.email);
    
    // Set a password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log('✅ Password set successfully!');
    console.log('You can now login with:');
    console.log('Email:', user.email);
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setPasswordForUser();