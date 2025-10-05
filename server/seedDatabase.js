require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const connectDB = require('./config/database');

const sampleUsers = [
  {
    username: 'atharva_shah',
    email: 'atharva_shah@example.com',
    password: 'password123',
    bio: 'Full-stack developer passionate about JavaScript and React.',
    role: 'user'
  },
  {
    username: 'siddharth_singh',
    email: 'siddharth_singh@example.com',
    password: 'password123',
    bio: 'Tech writer and blogger sharing insights about web development.',
    role: 'user'
  },
  {
    username: 'admin_user',
    email: 'admin@example.com',
    password: 'admin123',
    bio: 'ByteJournal administrator and content moderator.',
    role: 'admin'
  },
  {
    username: 'grish_tech',
    email: 'grish_tech@example.com',
    password: 'password123',
    bio: 'DevOps engineer interested in cloud technologies and automation.',
    role: 'user'
  }
];

const samplePosts = [
  {
    title: 'Getting Started with React Hooks',
    content: `
# Getting Started with React Hooks

React Hooks have revolutionized the way we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and how they can improve your React development experience.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the preferred way to write React components.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Best Practices

1. Always use hooks at the top level of your React function
2. Only call hooks from React functions
3. Use multiple state variables for independent state
4. Consider using useReducer for complex state logic

Happy coding!
    `,
    excerpt: 'Learn how React Hooks can transform your development workflow with practical examples and best practices.',
    category: 'React',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    status: 'published'
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    content: `
# Building RESTful APIs with Node.js and Express

Creating robust APIs is essential for modern web applications. In this tutorial, we'll build a complete RESTful API using Node.js and Express.

## Setting Up the Project

First, let's initialize our project:

\`\`\`bash
npm init -y
npm install express mongoose cors helmet dotenv
npm install -D nodemon
\`\`\`

## Creating the Express Server

Here's a basic Express server setup:

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Database Connection

Connect to MongoDB using Mongoose:

\`\`\`javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
\`\`\`

## Creating Models

Define your data models:

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
\`\`\`

## API Endpoints

Implement CRUD operations for your resources following REST conventions.

This foundation will help you build scalable and maintainable APIs for your applications.
    `,
    excerpt: 'A comprehensive guide to building scalable RESTful APIs using Node.js, Express, and MongoDB.',
    category: 'Backend',
    tags: ['nodejs', 'express', 'api', 'mongodb', 'backend'],
    status: 'published'
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use What',
    content: `
# CSS Grid vs Flexbox: When to Use What

Both CSS Grid and Flexbox are powerful layout systems, but knowing when to use each one can significantly improve your CSS skills.

## Understanding the Differences

### Flexbox: One-Dimensional Layout
Flexbox is designed for laying out items in a single dimension - either in a row or a column.

### CSS Grid: Two-Dimensional Layout
CSS Grid is designed for laying out items in two dimensions - rows and columns simultaneously.

## When to Use Flexbox

1. **Navigation bars** - Perfect for horizontal or vertical navigation
2. **Center content** - Easy vertical and horizontal centering
3. **Card layouts** - When you need equal height cards
4. **Form controls** - Aligning form elements

Example:
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## When to Use CSS Grid

1. **Page layouts** - Overall page structure
2. **Complex layouts** - When you need precise control
3. **Responsive design** - Grid areas can reorganize easily
4. **Magazine-style layouts** - Complex, non-uniform grids

Example:
\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`

## Can You Use Both Together?

Absolutely! Grid for the overall layout, Flexbox for component-level layouts.

Choose the right tool for the job, and your CSS will be cleaner and more maintainable.
    `,
    excerpt: 'Understanding when to use CSS Grid vs Flexbox for better layout design and cleaner code.',
    category: 'CSS',
    tags: ['css', 'grid', 'flexbox', 'layout', 'frontend'],
    status: 'published'
  },
  {
    title: 'Introduction to TypeScript for JavaScript Developers',
    content: `
# Introduction to TypeScript for JavaScript Developers

TypeScript has become increasingly popular among JavaScript developers. Let's explore why and how to get started.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static type definitions to JavaScript.

## Why Use TypeScript?

1. **Better IDE support** - IntelliSense, autocomplete, refactoring
2. **Catch errors early** - Type checking at compile time
3. **Better documentation** - Types serve as documentation
4. **Easier refactoring** - Confidence when making changes

## Basic Types

\`\`\`typescript
// Basic types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
interface User {
  id: number;
  name: string;
  email: string;
}

let user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## Functions

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Arrow function
const add = (a: number, b: number): number => a + b;

// Optional parameters
function buildName(firstName: string, lastName?: string): string {
  return lastName ? \`\${firstName} \${lastName}\` : firstName;
}
\`\`\`

## Interfaces

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
}
\`\`\`

## Getting Started

1. Install TypeScript: \`npm install -g typescript\`
2. Create a \`tsconfig.json\` file
3. Start converting your \`.js\` files to \`.ts\`
4. Gradually add types

TypeScript can significantly improve your development experience and code quality. Start small and gradually adopt more TypeScript features as you become comfortable.
    `,
    excerpt: 'A beginner-friendly introduction to TypeScript, covering basic types, interfaces, and practical examples.',
    category: 'TypeScript',
    tags: ['typescript', 'javascript', 'types', 'development'],
    status: 'published'
  },
  {
    title: 'My Journey Learning Web Development',
    content: `
# My Journey Learning Web Development

Starting as a complete beginner, here's how I learned web development and what I wish I knew earlier.

## The Beginning

I started with no coding experience whatsoever. The sheer amount of technologies and frameworks was overwhelming.

## What I Learned First

1. **HTML** - The foundation of web pages
2. **CSS** - Making things look good
3. **JavaScript** - Adding interactivity

## Challenges I Faced

- **Imposter syndrome** - Feeling like I didn't belong
- **Information overload** - Too many tutorials and courses
- **Tutorial hell** - Watching tutorials without building

## What Helped Me

### Building Projects
Nothing beats building actual projects. Start small:
- Personal portfolio
- Todo app
- Weather app
- Blog (like this one!)

### Community
Join developer communities:
- Discord servers
- Reddit communities
- Local meetups
- Twitter/X tech community

### Consistency
Even 30 minutes a day makes a huge difference over time.

## Current Status

I'm now comfortable with:
- React and Next.js
- Node.js and Express
- MongoDB
- TypeScript
- Git and GitHub

## Advice for Beginners

1. **Start building early** - Don't just consume content
2. **Don't try to learn everything** - Focus on fundamentals
3. **Embrace the struggle** - It's part of the process
4. **Find a community** - Learning with others is more fun
5. **Be consistent** - Small daily progress adds up

## What's Next?

I'm currently exploring:
- Advanced React patterns
- System design
- DevOps and deployment
- Open source contributions

The journey never really ends, and that's the beauty of web development!
    `,
    excerpt: 'A personal reflection on learning web development, including challenges faced and lessons learned.',
    category: 'Personal',
    tags: ['learning', 'beginner', 'journey', 'webdev'],
    status: 'published'
  }
];

const sampleComments = [
  {
    content: 'Great article! React hooks really changed how I write components.',
    postIndex: 0 // Will be replaced with actual post ID
  },
  {
    content: 'Thanks for the practical examples. The useState explanation was very clear.',
    postIndex: 0
  },
  {
    content: 'This is exactly what I needed to understand Express better. Thank you!',
    postIndex: 1
  },
  {
    content: 'The middleware explanation helped me a lot. Any recommendations for authentication?',
    postIndex: 1
  },
  {
    content: 'I always struggled with Grid vs Flexbox. This clarifies everything!',
    postIndex: 2
  },
  {
    content: 'Perfect timing! I was just wondering when to use which layout method.',
    postIndex: 2
  },
  {
    content: 'As a JavaScript developer, this TypeScript intro is perfect. Not too overwhelming.',
    postIndex: 3
  },
  {
    content: 'Your journey is inspiring! I\'m just starting out and this gives me hope.',
    postIndex: 4
  },
  {
    content: 'Thank you for sharing your experience. The consistency advice is spot on.',
    postIndex: 4
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create posts
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = {
        ...samplePosts[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      const post = new Post(postData);
      await post.save();
      createdPosts.push(post);
      console.log(`Created post: ${post.title}`);
    }

    // Create comments
    for (const commentData of sampleComments) {
      const comment = new Comment({
        content: commentData.content,
        post: createdPosts[commentData.postIndex]._id,
        author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id
      });
      await comment.save();
      console.log(`Created comment on post: ${createdPosts[commentData.postIndex].title}`);
    }

    // Add some likes to posts
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      const randomUsers = createdUsers.slice(0, Math.floor(Math.random() * 3) + 1);
      post.likes = randomUsers.map(user => user._id);
      await post.save();
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdPosts.length} posts`);
    console.log(`Created ${sampleComments.length} comments`);
    
    console.log('\n📧 Sample user credentials:');
    console.log('Username: atharva_shah, Email: atharva_shah@example.com, Password: password123');
    console.log('Username: siddharth_singh, Email: siddharth_singh@example.com, Password: password123');
    console.log('Username: admin_user, Email: admin@example.com, Password: admin123');
    console.log('Username: grish_tech, Email: grish_tech@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeding function
seedDatabase();