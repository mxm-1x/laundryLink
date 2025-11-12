# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Setup

### Code Changes
- [x] TypeScript moved to `dependencies` in `package.json`
- [x] Build script updated to compile and prune
- [x] `.env.example` created with all required variables
- [x] `.gitignore` updated to exclude sensitive files
- [x] DEPLOYMENT.md created with platform-specific guides

### Local Testing
- [x] `npm install` runs without errors
- [x] `npm run build` compiles successfully
- [x] `dist/` folder contains compiled JavaScript
- [x] `npm run start` starts the server

---

## 📋 Deployment Platforms Checklist

### Railway ✅
- [ ] Connect GitHub repository
- [ ] Add environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
- [ ] Set Node.js version to 20.x
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run start`
- [ ] Deploy

### Render ✅
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Add environment variables (same as above)
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run start`
- [ ] Deploy

### Vercel ✅
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Build: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm ci`
- [ ] Deploy

### Heroku ✅
- [ ] Create `Procfile`: `web: npm run start`
- [ ] Set Node version in `package.json` engines
- [ ] Push to Heroku remote
- [ ] Set environment variables via CLI or dashboard
- [ ] Monitor logs: `heroku logs --tail`

### Docker ✅
- [ ] Create Dockerfile (provided in DEPLOYMENT.md)
- [ ] Build image: `docker build -t laundrylink-backend .`
- [ ] Run container with env variables
- [ ] Test endpoint

### AWS/GCP/Azure ✅
- [ ] Review DEPLOYMENT.md for cloud-specific setup
- [ ] Configure networking/security groups
- [ ] Set environment variables
- [ ] Deploy and monitor

### VPS (Ubuntu/Debian) ✅
- [ ] Install Node.js 20
- [ ] Clone repository
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Setup environment variables
- [ ] Build: `npm run build`
- [ ] Start with PM2
- [ ] Setup Nginx reverse proxy
- [ ] Enable HTTPS with Let's Encrypt

---

## 🔒 Security Checklist

- [ ] `.env` file is NOT committed to Git
- [ ] `JWT_SECRET` is a strong random string (not default)
- [ ] `DATABASE_URL` uses SSL/TLS (sslmode=require)
- [ ] HTTPS is enabled on production
- [ ] CORS is configured for your frontend domain
- [ ] Environment variables are set on hosting platform
- [ ] `.env.example` has no secrets, only structure
- [ ] Rate limiting is configured
- [ ] API logging is enabled

---

## 🧪 Post-Deployment Testing

After deploying, test these endpoints:

### Health Check
```bash
curl http://your-backend-url/api/health
# Should return 200 OK
```

### Authentication
```bash
# Register staff
curl -X POST http://your-backend-url/api/auth/staff/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://your-backend-url/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Database Connection
```bash
# This will fail if DB isn't accessible
# Check logs for connection errors
```

---

## 📊 Monitoring Setup

### Logging
- [ ] Check hosting platform logs regularly
- [ ] Setup error alerts
- [ ] Monitor database performance
- [ ] Track API response times

### Uptime Monitoring
- [ ] Setup uptime monitoring service
- [ ] Configure alerts for downtime
- [ ] Setup health checks

### Metrics
- [ ] Monitor CPU usage
- [ ] Monitor memory usage
- [ ] Monitor database connections
- [ ] Monitor API request volume

---

## 🔄 Environment Variables Reference

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ Yes |
| `JWT_SECRET` | `a1b2c3d4e5f6...` | ✅ Yes |
| `JWT_EXPIRES_IN` | `7d` | ✅ Yes |
| `NODE_ENV` | `production` | ⚠️ Recommended |
| `PORT` | `3000` | ⚠️ Recommended |

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module"
```bash
# Solution: TypeScript should be in dependencies, not devDependencies
# Check: npm ls typescript
# Should show it as a top-level dependency
```

### Database Connection Error
```bash
# Check DATABASE_URL is correct
# Verify database is accessible from your host
# Add SSL parameters: ?sslmode=require
```

### Port Already in Use
```bash
# Change PORT environment variable
# Or kill process using the port
```

### CORS Errors
```bash
# Add frontend URL to CORS configuration in src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
```

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **Neon Docs**: https://neon.tech/docs
- **Node.js Docs**: https://nodejs.org/docs

---

## ✨ You're Ready to Deploy!

Your backend is production-ready. Follow the checklist for your chosen platform and deploy with confidence! 🚀

For detailed platform-specific instructions, see `DEPLOYMENT.md`
