# Deployment Checklist & Troubleshooting

## ✅ Quick Fix for "Could not connect to server" Error

### Problem
Frontend on Vercel can't connect to Railway backend because `VITE_API_URL` is still set to `localhost:5000`.

### Solution

#### 1. Get Your Railway Backend URL
- Go to Railway Dashboard → Your Backend Project
- Look for the "Public Domain" or URL in the deployment settings
- Example: `https://scholarship-finder-api.railway.app`

#### 2. Add to Vercel Environment Variables
1. Go to **Vercel Dashboard** 
2. Select your project → **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://scholarship-finder-api.railway.app` (replace with your actual URL)
4. Click **Add**
5. Go to **Deployments** → **Redeploy** your main branch

#### 3. Verify Backend Connection on Railway
Run this command to test:
```bash
curl https://your-railway-url/api/health
```

You should get: `{"status":"Server is running"}`

---

## 🚀 Complete Railway Backend Setup

### Step 1: Set Environment Variables in Railway
In your Railway MySQL + Backend project, set these variables:

```
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_NAME=sfs
DB_USER=root
DB_PASSWORD=[your-railway-mysql-password]
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app
JWT_SECRET=[generate-a-random-secret]
GOOGLE_CLIENT_ID=[your-google-client-id]
```

### Step 2: Verify Database Connection
- Check Railway MySQL logs
- Ensure tables are created (user, scholarship, etc.)

### Step 3: Deploy Backend
- Railway auto-deploys when you push to your main branch
- Check deployment logs in Railway Dashboard

---

## 🎯 Complete Vercel Frontend Setup

### Step 1: Set Environment Variables
- **Name**: `VITE_API_URL`
- **Value**: `https://your-railway-backend-url` (without trailing slash)

### Step 2: Build & Deploy
- Trigger new deployment: Go to Deployments → Redeploy
- Wait for build to complete (usually 2-5 minutes)

### Step 3: Test Login
1. Go to your Vercel domain
2. Click "Login"
3. You should NOT see the "Could not connect to server" error anymore

---

## 🔧 Troubleshooting

### Still Getting Connection Error?
1. ✅ Check Vercel deployment logs
   - Go to Deployments → Click latest → View Logs
   - Look for build errors

2. ✅ Check Railway backend is running
   - Go to Railway Dashboard → Backend service
   - Status should show "Running"

3. ✅ Verify environment variables
   - Redeploy after adding env vars (important!)
   - Use `curl` to test backend endpoint

4. ✅ Clear browser cache
   - Ctrl+Shift+Delete → Clear cache
   - Refresh page

### Database Connection Failed on Railway?
- Verify MySQL service is running (green status)
- Check DB_PASSWORD is correct
- Run migrations if needed

### Google Login Not Working?
- Add your Vercel domain to Google OAuth Authorized Redirect URIs
- Google Console → Your App → OAuth 2.0 Credentials → Edit → Add `https://your-vercel-domain.vercel.app/` to authorized origins

---

## 📋 Local Development (After Production Setup)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev

# Backend will run on http://localhost:5000
# Frontend will run on http://localhost:5173
```

Your `.env` files are already configured for local development ✅
