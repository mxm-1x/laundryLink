# Render.com Deployment Guide

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account with your code pushed
- Render.com account (free tier available)
- Neon PostgreSQL database (or other PostgreSQL)

---

## Step-by-Step Deployment

### 1. **Push Your Code to GitHub**

```bash
cd /Users/msm/Documents/coding/class_projects/LaundryLink/backend
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. **Sign Up/Login to Render**

Go to: https://render.com/

### 3. **Create New Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `LaundryLink` repository
4. Configure the service:

### 4. **Service Configuration**

| Setting | Value |
|---------|-------|
| **Name** | `laundrylink-backend` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` (if monorepo) or leave empty |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free |

### 5. **Environment Variables**

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_VERSION` | `20.16.0` | Specify Node.js version |
| `DATABASE_URL` | `postgresql://...` | Your Neon DB connection string |
| `JWT_SECRET` | `your_random_secret` | Generate a secure secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Port (Render auto-assigns, but good to have) |

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. **Deploy**

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Start your server (`npm run start`)

### 7. **Monitor Deployment**

Watch the logs in real-time. You should see:
```
==> Cloning from https://github.com/...
==> Downloading cache...
==> Running 'npm install && npm run build'
> laundrylink@1.0.0 build
> tsc
==> Build successful 🎉
==> Starting service with 'npm run start'
🚀 Server running on port 3000
==> Your service is live 🎉
```

### 8. **Get Your API URL**

Render will provide you with a URL like:
```
https://laundrylink-backend.onrender.com
```

---

## 🔧 Important Configuration Notes

### ✅ **DO**
- Use `npm install` (installs ALL dependencies)
- Keep TypeScript and @types/* in `dependencies`
- Set all environment variables in Render dashboard
- Use HTTPS for DATABASE_URL (Neon provides this)

### ❌ **DON'T**
- Use `npm ci --production` (will skip devDependencies)
- Use `npm prune --production` during build
- Hardcode secrets in your code
- Commit `.env` file to Git

---

## 🔒 Security Setup

### 1. **Update Frontend API URL**

In your frontend `.env`:
```bash
VITE_API_BASE_URL=https://laundrylink-backend.onrender.com/api
```

### 2. **Configure CORS**

Update `src/app.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

Add to Render environment variables:
```
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. **Enable HTTPS**

Render provides free SSL certificates automatically! ✅

---

## 🧪 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://laundrylink-backend.onrender.com/api/health
```

### Test Staff Registration
```bash
curl -X POST https://laundrylink-backend.onrender.com/api/auth/staff/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@laundrylink.com",
    "password": "admin123"
  }'
```

### Test Staff Login
```bash
curl -X POST https://laundrylink-backend.onrender.com/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@laundrylink.com",
    "password": "admin123"
  }'
```

---

## 📊 Monitoring & Logs

### View Logs
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### Common Log Messages
```bash
# Good ✅
🚀 Server running on port 3000
Connected to database

# Issues ⚠️
Error: connect ECONNREFUSED
# Solution: Check DATABASE_URL

Error: Cannot find module
# Solution: Ensure npm install runs before build
```

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module 'express'"

**Problem:** Dependencies not installed
**Solution:** Build command should be:
```bash
npm install && npm run build
```

### Database Connection Error

**Problem:** DATABASE_URL incorrect or database unreachable
**Solution:**
1. Verify DATABASE_URL in Render environment variables
2. Check Neon database is active
3. Ensure SSL mode is enabled: `?sslmode=require`

### Port Already in Use

**Problem:** Multiple instances running
**Solution:** Render handles this automatically, restart service

### CORS Errors

**Problem:** Frontend can't access API
**Solution:** Add FRONTEND_URL to environment variables and update CORS config

---

## 🔄 Auto-Deploy on Git Push

Render automatically deploys when you push to your main branch!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will automatically rebuild and redeploy 🚀
```

### Disable Auto-Deploy
1. Go to service settings
2. Under **"Auto-Deploy"**
3. Toggle off

---

## 💰 Render Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| **RAM** | 512 MB |
| **Build Minutes** | 500/month |
| **Bandwidth** | 100 GB/month |
| **Sleep After** | 15 min inactivity |
| **Cold Start** | ~30 seconds |

**Note:** Free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## 🚀 Upgrade to Paid Plan

For production apps:
- **Starter:** $7/month
  - No sleep
  - Faster builds
  - More resources

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Community:** https://community.render.com
- **Status:** https://status.render.com

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] Render account created
- [x] Web service created
- [x] Build command: `npm install && npm run build`
- [x] Start command: `npm run start`
- [x] Environment variables set
- [x] Database connected
- [x] Service deployed successfully
- [x] API tested with curl
- [x] Frontend updated with production URL
- [x] CORS configured

**Your backend is live! 🎉**

URL: `https://laundrylink-backend.onrender.com`
