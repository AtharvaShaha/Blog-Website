# ByteJournal - Full Stack Setup Guide

## Overview
ByteJournal is a modern MERN stack blogging platform with the following features:
- User authentication (register/login)
- Create, read, update, delete blog posts
- Comment system
- User profiles
- Responsive design with Tailwind CSS

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Database**: MongoDB Atlas (cloud) with Mongoose ODM

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 2. Environment Configuration

#### Backend (.env in server folder)
The `.env` file is already configured with:
- MongoDB Atlas connection
- JWT secrets
- Google OAuth credentials
- Server port (5002)
- CORS settings

#### Frontend (.env.local in client folder)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database Setup

The database has been seeded with sample data including:
- 4 sample users
- 5 blog posts with rich content
- 9 comments across different posts

#### Sample User Accounts
```
Username: atharva_shah, Email: atharva_shah@example.com, Password: password123
Username: siddharth_singh, Email: siddharth_singh@example.com, Password: password123
Username: admin_user, Email: admin@example.com, Password: admin123
Username: grish_tech, Email: grish_tech@example.com, Password: password123
```

### 4. Running the Application

#### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5002

#### Start Frontend Server
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:3000

## Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Google OAuth integration (configured)
- ✅ Protected routes
- ✅ Logout functionality

### Posts Management
- ✅ View all published posts
- ✅ Individual post pages
- ✅ Create new posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Like posts
- ✅ Rich text content support

### User Interface
- ✅ Responsive design
- ✅ Dashboard layout
- ✅ Post cards with metadata
- ✅ Navigation and sidebar
- ✅ Toast notifications
- ✅ Loading states and error handling

### Backend API
- ✅ RESTful API endpoints
- ✅ User authentication middleware
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Security headers

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/google` - Google OAuth

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Create comment
- `PUT /api/posts/:postId/comments/:commentId` - Update comment
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment

## Testing the Application

### 1. Basic Flow Test
1. Visit http://localhost:3000
2. Click "Sign up" to create a new account
3. Or use existing credentials: `john@example.com` / `password123`
4. After login, you'll be redirected to the dashboard
5. Browse posts in the "All Posts" section
6. Create a new post using "Create Post"

### 2. Features to Test
- ✅ User registration and login
- ✅ Viewing posts with proper formatting
- ✅ Navigation between pages
- ✅ Responsive design on different screen sizes
- ✅ Error handling for invalid inputs

## Development Notes

### Frontend Structure
```
client/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Protected main pages
│   ├── components/      # Reusable components
│   └── redux/           # State management
└── lib/
    └── api.ts           # API service layer
```

### Backend Structure
```
server/
├── config/              # Database and service configs
├── controllers/         # Route handlers
├── middleware/          # Authentication and validation
├── models/              # Mongoose schemas
├── routes/              # API routes
└── utils/               # Helper functions
```

### Key Files Added/Modified
- `server/seedDatabase.js` - Database seeding script
- `client/lib/api.ts` - API service layer
- `client/.env.local` - Frontend environment variables
- Updated authentication pages with proper API integration
- Enhanced PostCard component with proper typing
- Fixed dashboard layout with logout functionality

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for `http://localhost:3000`
2. **Database connection**: Check MongoDB Atlas connection string in `.env`
3. **JWT errors**: Verify JWT secrets are set in backend `.env`
4. **Port conflicts**: Backend uses port 5000, frontend uses port 3000

### Re-seeding Database
If you need to reset the database with fresh sample data:
```bash
cd server
node seedDatabase.js
```

## Next Steps
The application is fully functional with:
- Complete authentication system
- Post management
- Comment system (backend ready, frontend can be extended)
- Responsive UI
- Proper error handling

You can now:
1. Add more features like user profiles
2. Implement image upload for posts
3. Add search and filtering
4. Enhance the comment system UI
5. Add admin panel features
