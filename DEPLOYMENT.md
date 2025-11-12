# Backend Deployment Guide

## 🚀 Production Deployment Instructions

### Prerequisites
- Node.js 20.x
- npm 10.x
- PostgreSQL database (Neon or similar)

### Local Setup (Before Deployment)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your values:**
   ```bash
   DATABASE_URL="your_production_database_url"
   JWT_SECRET="your_secure_secret_key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV="production"
   ```

5. **Test locally:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deployment on Hosting Platforms

### **Railway/Render/Netlify**

1. **Connect your repository** to the hosting platform

2. **Set environment variables:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`
   - `PORT=3000`

3. **Configure build settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Node Version:** `20.x`

4. **Deploy** - Platform will automatically run build and start

**Important for Render:**
- Render automatically installs dependencies before build
- DO NOT use `npm ci --production` or `npm prune` in build command
- All dependencies (including TypeScript) must be available during build

### **Heroku**

1. **Create Procfile:**
   ```
   web: npm run start
   ```

2. **Add to package.json:**
   ```json
   "engines": {
     "node": "20.x",
     "npm": "10.x"
   }
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### **AWS/GCP/Azure with Docker**

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Build application
RUN npm run build

# Remove devDependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start"]
```

**Deploy:**
```bash
docker build -t laundrylink-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e JWT_SECRET="your_secret" \
  laundrylink-backend
```

### **VPS (Ubuntu/Debian)**

1. **SSH into server:**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js 20:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

4. **Setup environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

5. **Install PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   ```

6. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

7. **Start with PM2:**
   ```bash
   pm2 start "npm run start" --name "laundrylink-backend"
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable HTTPS with Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your_domain.com
   ```

---

## 🔒 Production Environment Variables

Always set these in your hosting platform:

```bash
# Required
DATABASE_URL="postgresql://..."
JWT_SECRET="use_a_strong_random_string"

# Recommended
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT=3000
```

### Generating a Secure JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] CORS configured for frontend domain
- [ ] Error logging setup
- [ ] Database backups scheduled
- [ ] API endpoints tested
- [ ] Rate limiting configured
- [ ] Health check endpoint working

---

## 📊 Monitoring & Logs

### Railway/Render
- Check **Logs** tab in dashboard

### Heroku
```bash
heroku logs --tail
```

### PM2 (VPS)
```bash
pm2 logs laundrylink-backend
pm2 monit
```

### Docker
```bash
docker logs <container-id>
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Ensure `npm install` runs during build
- Check that TypeScript dependencies are in `dependencies` (not `devDependencies`)

### Database connection issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from your host
- Ensure SSL/TLS parameters are correct

### Port already in use
- Check what's using the port: `lsof -i :3000`
- Change `PORT` environment variable

### Build fails on platform
- Run `npm run build` locally first
- Check Node.js version matches requirement
- Verify all environment variables are set

---

## 🚀 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npm run build
      - name: Deploy to Railway
        run: npm install -g @railway/cli && railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

**For questions or issues, check your hosting platform's documentation!**
