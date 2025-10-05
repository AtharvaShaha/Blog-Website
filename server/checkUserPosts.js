require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/database');

async function checkUserAndPosts() {
  try {
    await connectDB();
    
    // Find atharva_shah
    const user = await User.findOne({ username: 'atharva_shah' });
    console.log('User found:');
    console.log('- ID:', user._id.toString());
    console.log('- Username:', user.username);
    console.log('- Email:', user.email);
    
    // Find posts by this user
    const userPosts = await Post.find({ author: user._id }).populate('author', 'username');
    console.log('\nPosts by this user:');
    console.log('- Total posts:', userPosts.length);
    
    userPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Author ID: ${post.author._id}`);
      console.log(`   Author Username: ${post.author.username}`);
      console.log(`   Views: ${post.views || 0}`);
      console.log(`   Likes: ${post.likes?.length || 0}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUserAndPosts();