# 🚀 Deployment Guide - Room Booking System

## Complete Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Supabase account with database setup complete
- Node.js 18+ installed locally

---

## 📋 Part 1: GitHub Setup (5 minutes)

### 1.1 Initialize Git Repository

\`\`\`bash
# Navigate to project directory
cd room-booking-system

# Initialize git (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "feat: Initial room booking system with authentication, rooms, and reservations management

- Authentication system with JWT and role-based access
- Rooms management (CRUD for admins)
- Reservation system with double-booking prevention
- User dashboard for managing bookings
- Admin dashboard with statistics
- Complete API routes for all operations
- Database schema with RLS policies
- Responsive design with Tailwind CSS"
\`\`\`

### 1.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `room-booking-system`
3. Description: `A complete room booking system with authentication, room management, and reservations`
4. Select "Public" (can be private)
5. Click "Create repository"

### 1.3 Push to GitHub

\`\`\`bash
# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/room-booking-system.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main

# You should see all commits pushed successfully
\`\`\`

### 1.4 Verify GitHub

Visit `https://github.com/YOUR_USERNAME/room-booking-system`
- ✅ All files are uploaded
- ✅ Commit history visible
- ✅ README.md displays properly

---

## 📋 Part 2: Vercel Deployment (5 minutes)

### 2.1 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in (or create account)
3. Click **"New Project"**
4. Select **"Import Git Repository"**
5. Search for `room-booking-system`
6. Click "Import"

### 2.2 Configure Project Settings

**Project Name**: `room-booking-system` (or your choice)

**Framework Preset**: Next.js (should auto-detect)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 2.3 Environment Variables

Click **"Environment Variables"** and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | `https://your-app-name.vercel.app` |

**Where to find these values:**
- Go to [app.supabase.com](https://app.supabase.com)
- Select your project
- Click "Settings" → "API"
- Copy the required keys

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Once complete, you'll see a ✅ success message
4. Your app is live at: `https://your-app-name.vercel.app`

---

## ✅ Part 3: Verify Deployment (5 minutes)

### 3.1 Test Public Pages

\`\`\`
✅ Homepage: https://your-app-name.vercel.app
✅ Login: https://your-app-name.vercel.app/auth/login
✅ Sign Up: https://your-app-name.vercel.app/auth/sign-up
\`\`\`

### 3.2 Test Authentication

1. Go to Sign Up page
2. Create a test account:
   - Email: `test@example.com`
   - Password: `TestPass123!`
3. You should be redirected to dashboard
4. Click "Browse Rooms" to view available rooms

### 3.3 Test User Features

- ✅ View rooms list
- ✅ Click on a room to see details
- ✅ Try to book a room with valid times
- ✅ Go to dashboard → "My Bookings" to see reservation
- ✅ Cancel a reservation

### 3.4 Create Admin Account (Manual)

1. From your Supabase dashboard:
   - Go to "Authentication" → "Users"
   - Find your test user
   - Edit the user
   - Find the `role` field in metadata (or create it)
   - Change `role` to `admin`

2. Or via SQL in Supabase SQL Editor:
\`\`\`sql
-- Update user role to admin
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'), '{role}', '"admin"')
WHERE email = 'test@example.com';
\`\`\`

### 3.5 Test Admin Features

1. Login with admin account
2. Click "Admin Dashboard" (if visible)
3. Test admin features:
   - ✅ Create a new room
   - ✅ Edit room details
   - ✅ View all reservations
   - ✅ See system statistics

## Admin API & Migration Updates

The project includes server-side admin endpoints and a migration script to align the `rooms` table with the assignment fields. Run the migration in your Supabase project before testing admin features.

Server-side admin endpoints (require admin role):

- `POST /api/admin/promote` — Promote a user to admin. Body: `{ "user_id": "..." }` or `{ "email": "..." }`.
- `GET /api/admin/reservations` — Admin-only list of all reservations with room and user info.
- `GET /api/admin/rooms` — Admin-only list of all rooms (including inactive).
- `POST /api/admin/rooms` — Admin-only create room.
- `PUT /api/admin/rooms/:id` — Admin-only update room.
- `DELETE /api/admin/rooms/:id` — Admin-only delete room.

Migration file:

- `scripts/003_migrate_rooms.sql` — Adds `room_number`, `beds`, and `is_active` columns to `public.rooms` and attempts to populate them from existing `name` and `capacity` columns. Run this in Supabase SQL Editor (and run `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` first if required).

See `TESTING_MANUAL.md` for a smoke-test checklist after applying the migration.

---

## 🔄 Part 4: Continuous Deployment (Auto-Updates)

Vercel automatically redeploys when you push to GitHub:

\`\`\`bash
# Make code changes locally
echo "# Updated" >> README.md

# Commit and push
git add .
git commit -m "docs: Update README"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Rebuild the project
# 3. Deploy the new version
# 4. Update your live site
\`\`\`

Check deployment status at: `https://vercel.com/dashboard`

---

## 📊 Part 5: Monitoring & Logs

### 5.1 View Deployment Logs

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Deployments" tab
4. Click the deployment to view logs

### 5.2 View Runtime Errors

1. Click "Functions" tab to see API logs
2. Click "Monitoring" to see performance metrics

### 5.3 Troubleshoot Issues

**Build Failed?**
\`\`\`bash
# Rebuild locally to test
npm run build
npm run dev
\`\`\`

**Environment Variables Missing?**
- Go to Vercel → Project Settings → Environment Variables
- Verify all variables are added
- Redeploy with new variables: Vercel Dashboard → Deployments → Click latest → "Redeploy"

---

## 🎯 Final Checklist

- [ ] GitHub repository created
- [ ] All code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Deployment successful (green checkmark)
- [ ] Homepage loads correctly
- [ ] Can create user account
- [ ] Can login successfully
- [ ] Can view rooms
- [ ] Can create reservation
- [ ] Can view user dashboard
- [ ] Admin account created
- [ ] Can access admin panel
- [ ] Can manage rooms
- [ ] Can view all reservations
- [ ] Auto-deployment working (code → GitHub → Vercel)

---

## 📝 Your Deployment URLs

**Live Application**:
\`\`\`
https://your-app-name.vercel.app
\`\`\`

**GitHub Repository**:
\`\`\`
https://github.com/YOUR_USERNAME/room-booking-system
\`\`\`

**Vercel Dashboard**:
\`\`\`
https://vercel.com/dashboard/room-booking-system
\`\`\`

**Test Credentials**:
\`\`\`
User Email: test@example.com
User Password: TestPass123!
User Role: user

Admin Email: test-admin@example.com
Admin Password: AdminPass123!
Admin Role: admin
\`\`\`

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found" error
**Solution**:
\`\`\`bash
npm install
npm run build
# Then redeploy
\`\`\`

### Issue: Supabase connection timeout
**Solution**:
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check Supabase project is active
- Wait 5 minutes for DNS propagation

### Issue: Authentication not working
**Solution**:
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Verify NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL matches your Vercel URL
- Check Supabase Auth providers are enabled

### Issue: Database not connecting
**Solution**:
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check database migrations were run
- Check Supabase project status

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **This Project**: Check README.md in repository

---

**Deployment Status**: ✅ Ready to Deploy
**Estimated Time**: 15 minutes total
**Difficulty**: Beginner Friendly
