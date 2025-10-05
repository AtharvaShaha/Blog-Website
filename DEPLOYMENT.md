# ByteJournal Deployment Guide

## Live Application

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Railway URL]
- **Repository**: https://github.com/AtharvaShaha/Blog-Website

## Deployment Architecture

### Frontend (Next.js) - Vercel
- **Platform**: Vercel
- **URL**: `https://your-app.vercel.app`
- **Features**: Automatic deployments, Edge Network, SSL

### Backend (Node.js/Express) - Railway
- **Platform**: Railway
- **URL**: `https://your-backend.railway.app`
- **Features**: Auto-scaling, Environment variables, Continuous deployment

### Database - MongoDB Atlas
- **Platform**: MongoDB Atlas
- **Type**: Cloud database cluster
- **Features**: Automatic backups, Global clusters, Built-in security

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway Environment)
```
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
CLIENT_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Deployment Steps

### 1. Deploy Backend to Railway
1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `AtharvaShaha/Blog-Website`
5. Choose the `server` folder as root directory
6. Set environment variables in Railway dashboard
7. Deploy and get your backend URL

### 2. Deploy Frontend to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `AtharvaShaha/Blog-Website`
5. Set root directory to `client`
6. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
7. Deploy and get your frontend URL

### 3. Update OAuth Callback URLs
Update Google OAuth settings:
- **Authorized JavaScript origins**: `https://your-app.vercel.app`
- **Authorized redirect URIs**: `https://your-backend.railway.app/api/auth/google/callback`

### 4. Configure Custom Domain (.dev)
1. Purchase your `.dev` domain (free with GitHub Education)
2. In Vercel: Settings → Domains → Add your `.dev` domain
3. Update DNS records as instructed by Vercel
4. Update `CLIENT_URL` in Railway environment variables

## Post-Deployment Checklist
- [ ] Backend API is accessible and returns data
- [ ] Frontend loads and connects to backend
- [ ] User authentication works (regular and Google OAuth)
- [ ] Post creation, editing, and deletion work
- [ ] Image uploads work (if Cloudinary is configured)
- [ ] Database operations are successful
- [ ] Environment variables are correctly set
- [ ] SSL certificates are active
- [ ] Custom domain points to the application

## Monitoring & Maintenance
- **Backend logs**: Railway dashboard
- **Frontend analytics**: Vercel dashboard
- **Database monitoring**: MongoDB Atlas dashboard
- **Performance**: Use Vercel Analytics and Railway metrics

## Support
For deployment issues, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)