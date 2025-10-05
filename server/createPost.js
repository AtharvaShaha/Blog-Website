require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/database');

async function createPostForUser() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ username: 'atharva_shah' });
    if (!user) {
      console.log('User atharva_shah not found');
      return;
    }

    console.log('Found user:', user.username, '- ID:', user._id);

    // Create a new post
    const newPost = new Post({
      title: 'My First Custom Post',
      content: `
# My First Custom Post

This is a test post created for **atharva_shah**!

## About This Post

This post was created to test the post creation functionality in ByteJournal.

## Features Tested

- ✅ Post creation
- ✅ Author assignment
- ✅ Content formatting
- ✅ Categories and tags

## Code Example

Here's a simple JavaScript function:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to ByteJournal.\`;
}

console.log(greet('Atharva'));
\`\`\`

## Conclusion

The post creation system is working perfectly! 🎉
      `,
      excerpt: 'A test post created for atharva_shah to verify the post creation functionality.',
      category: 'Technology',
      tags: ['test', 'javascript', 'blog', 'bytejournal'],
      author: user._id,
      status: 'published'
    });

    // Save the post
    await newPost.save();
    console.log('\n✅ Post created successfully!');
    console.log('Post ID:', newPost._id);
    console.log('Title:', newPost.title);
    console.log('Author:', user.username);
    console.log('Category:', newPost.category);
    console.log('Tags:', newPost.tags);

  } catch (error) {
    console.error('Error creating post:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
createPostForUser();