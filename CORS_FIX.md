# CORS Error Fix Guide

## 🔴 Problem: CORS Error in Production

When your frontend is deployed and tries to access your backend API, you see errors like:

```
Access to XMLHttpRequest at 'https://your-backend.com/api/...' from origin 'https://your-frontend.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solution Implemented

### What Was Changed

**Before (src/app.ts):**
```typescript
app.use(cors()); // ❌ Too restrictive for production
```

**After (src/app.ts):**
```typescript
const corsOptions = {
    origin: function (origin, callback) {
        // Allow localhost + production domains
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.FRONTEND_URL,
        ];
        
        // Also allow common hosting platforms
        if (origin.includes('vercel.app') || 
            origin.includes('netlify.app') || 
            origin.includes('render.com')) {
            callback(null, true);
        } else if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

## 🔧 Setup Steps

### Step 1: Add FRONTEND_URL to Environment Variables

**On Render (Backend):**
1. Go to your service dashboard
2. Click **Environment** tab
3. Add new variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-domain.vercel.app` (your actual frontend URL)
4. Click **Save Changes**

**On Vercel/Netlify (Frontend):**
1. Go to your project settings
2. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend.onrender.com/api`
3. Redeploy

### Step 2: Update Backend .env (Local Development)

```bash
FRONTEND_URL="http://localhost:5173"
```

### Step 3: Commit and Deploy

```bash
cd backend
git add .
git commit -m "fix: Configure CORS for production frontend"
git push origin main
```

Render will automatically redeploy with the new CORS settings.

---

## 📋 Environment Variables Checklist

### Backend (Render)

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://...` | ✅ Yes |
| `JWT_SECRET` | `abc123...` | ✅ Yes |
| `JWT_EXPIRES_IN` | `7d` | ✅ Yes |
| `NODE_ENV` | `production` | ⚠️ Recommended |
| `PORT` | `3000` | ⚠️ Recommended |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | ✅ **Yes (for CORS)** |

### Frontend (Vercel/Netlify)

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` | ✅ Yes |

---

## 🧪 Testing CORS Configuration

### Test 1: Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "LaundryLink API is running",
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

### Test 2: CORS Preflight (OPTIONS)
```bash
curl -X OPTIONS https://your-backend.onrender.com/api/auth/staff/login \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

Expected headers in response:
```
Access-Control-Allow-Origin: https://your-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Test 3: Login from Frontend
Open your deployed frontend in browser, open DevTools Console, and try:
```javascript
fetch('https://your-backend.onrender.com/api/auth/staff/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@laundrylink.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Should receive a token, not a CORS error.

---

## 🔍 Troubleshooting

### Still Getting CORS Error?

**Check 1: Verify FRONTEND_URL is set on Render**
```bash
# In Render dashboard, check Environment tab
# FRONTEND_URL should match your exact frontend domain
```

**Check 2: Verify backend is using the new code**
```bash
# Check Render logs, should show:
# "CORS configured with allowed origins: ..."
```

**Check 3: Check browser network tab**
- Request should include `Origin` header
- Response should include `Access-Control-Allow-Origin` header

**Check 4: Clear browser cache**
```bash
# In Chrome DevTools:
# Right-click refresh button → "Empty Cache and Hard Reload"
```

### Common Mistakes

❌ **Wrong:** `FRONTEND_URL=http://your-frontend.vercel.app` (missing https)
✅ **Correct:** `FRONTEND_URL=https://your-frontend.vercel.app`

❌ **Wrong:** `FRONTEND_URL=https://your-frontend.vercel.app/` (trailing slash)
✅ **Correct:** `FRONTEND_URL=https://your-frontend.vercel.app`

❌ **Wrong:** Not redeploying after adding FRONTEND_URL
✅ **Correct:** Render should auto-redeploy, or manually trigger deploy

---

## 🎯 Quick Fix Checklist

- [x] Updated `src/app.ts` with CORS configuration
- [x] Added `FRONTEND_URL` to `.env.example`
- [x] Added health check endpoint (`/api/health`)
- [ ] Set `FRONTEND_URL` in Render environment variables
- [ ] Committed and pushed changes
- [ ] Verified Render redeployed
- [ ] Tested from deployed frontend
- [ ] Checked browser console for errors
- [ ] Verified API calls work

---

## 📞 Still Having Issues?

### Enable CORS Debugging

Add this temporarily to `src/app.ts`:
```typescript
app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    console.log('Method:', req.method);
    next();
});
```

Check Render logs to see what origin is being sent.

### Allow All Origins (Temporary Testing Only)

**⚠️ NOT for production!** But for testing:
```typescript
app.use(cors({
    origin: '*',  // Allow all origins (INSECURE)
    credentials: false
}));
```

If this works, the issue is with your origin configuration, not CORS itself.

---

## 🔒 Production Best Practices

1. **Always specify exact origins** (not wildcards)
2. **Use HTTPS** in production
3. **Enable credentials** for cookie-based auth
4. **Whitelist specific methods** only
5. **Set allowed headers** explicitly
6. **Monitor CORS errors** in production logs

---

Your CORS is now configured for production! 🎉
