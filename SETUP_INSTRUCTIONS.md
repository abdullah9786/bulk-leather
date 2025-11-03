# 🚀 Complete Setup Instructions

## Get Your Dynamic Wholesale Leather Site Running

---

## ✅ **What You're Setting Up**

- **Frontend**: 6 beautiful pages with 3 themes
- **Backend**: REST API with MongoDB
- **Admin Dashboard**: Full management system
- **Shopping Cart**: Sample request system
- **Meeting Scheduler**: 3-step booking wizard

**Everything fetches from MongoDB - 100% dynamic!**

---

## 📋 **Prerequisites**

- Node.js 18+ installed
- Internet connection
- MongoDB Atlas account (free)

---

## 🎯 **Step 1: MongoDB Atlas Setup** (5 minutes)

### A. Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)

### B. Create FREE Cluster
1. Click **"Build a Database"**
2. Choose **M0 FREE tier**
3. Provider: **AWS** (recommended)
4. Region: **Choose closest to you**
5. Cluster Name: `Cluster0`
6. Click **"Create"** (wait 3-5 min)

### C. Create Database User
1. Go to **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `bulkleather`
4. Click **"Autogenerate Secure Password"**
5. **📝 SAVE THIS PASSWORD!**
6. Role: "Atlas admin"
7. Click **"Add User"**

### D. Whitelist IP
1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Click **"Confirm"**

### E. Get Connection String
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
4. It looks like:
   ```
   mongodb+srv://bulkleather:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🎯 **Step 2: Configure Project** (2 minutes)

### A. Create .env.local File

Create `.env.local` in project root:

```env
MONGODB_URI=mongodb+srv://bulkleather:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority

JWT_SECRET=kj234h5kj2h34k5jh23k4j5h2k3j4h523kj4h5k23jh45k23jh4k5

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `YOUR_PASSWORD` → Your MongoDB password
- `cluster0.xxxxx` → Your cluster address
- Add `/bulkleather?retryWrites=true&w=majority` at the end

**Final example:**
```env
MONGODB_URI=mongodb+srv://bulkleather:MyP@ssw0rd123@cluster0.abc123.mongodb.net/bulkleather?retryWrites=true&w=majority

JWT_SECRET=kj234h5kj2h34k5jh23k4j5h2k3j4h523kj4h5k23jh45k23jh4k5

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 **Step 3: Install & Start** (2 minutes)

### A. Install Dependencies
```bash
npm install
```

### B. Start Development Server
```bash
npm run dev
```

**You should see:**
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## 🎯 **Step 4: Initialize Database** (1 minute)

**Option A: Using Setup Button (Easiest)**

1. Open browser: `http://localhost:3000/admin/login`
2. You'll see **"First Time Setup Required"** message
3. Click **"Run Initial Setup"** button
4. Wait 5-10 seconds
5. You'll see success message with credentials

**Option B: Using Seed Script**

```bash
npm run seed
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ MongoDB Connected Successfully
👤 Creating admin user...
📁 Seeding categories...
📦 Seeding products...
💬 Seeding testimonials...
✅ Database seeded successfully!

📝 Admin Credentials:
   Email: admin@bulkleather.com
   Password: admin123
```

---

## 🎯 **Step 5: Login & Explore** (5 minutes)

### A. Admin Dashboard
```
URL: http://localhost:3000/admin/login
Email: admin@bulkleather.com
Password: admin123
```

**Test:**
- ✅ Dashboard shows real statistics
- ✅ View products list
- ✅ View categories grid
- ✅ Check inquiries (empty initially)
- ✅ Check meetings (empty initially)

### B. Public Website
```
URL: http://localhost:3000
```

**Test:**
- ✅ Home page shows products from database
- ✅ Categories in header dropdown
- ✅ Browse products page
- ✅ Click on a product
- ✅ Add sample to cart
- ✅ Schedule a meeting
- ✅ Submit contact form

---

## ✅ **Verification Steps**

### **1. Check Database Connection**
- Admin login page loads (no spinning loader)
- Setup button appears OR credentials work

### **2. Test Public Site**
- Home page shows 4 products
- Categories section shows 5 categories
- Testimonials section shows 4 testimonials
- Products page shows all 12 products

### **3. Test Forms**
- Submit contact form
- Go to admin → Inquiries
- Should see your submission!

### **4. Test Meeting Scheduler**
- Click floating "Schedule Meeting" button
- Complete 3 steps
- Submit
- Go to admin → Meetings
- Should see your meeting!

### **5. Test Sample Cart**
- Add product to sample cart
- Submit inquiry from cart
- Check admin → inquiry should show sample cart items!

---

## 🐛 **Troubleshooting**

### **❌ "Run Initial Setup" button doesn't work**

**Check:**
1. .env.local file exists with correct MongoDB URI
2. MongoDB password is correct
3. IP is whitelisted (0.0.0.0/0)
4. Internet connection

**Solution:**
- Check browser console (F12) for errors
- Verify MongoDB cluster is active (not paused)
- Try running `npm run seed` from terminal

### **❌ "Invalid credentials" error**

**Means:** Database is empty, admin user doesn't exist

**Solution:**
- Click "Run Initial Setup" button
- Or run `npm run seed`

### **❌ Home page not showing products**

**Check:**
- Browser console for errors
- Admin → Products (should show 12 products)
- Network tab (should see API calls to /api/products)

**Solution:**
- Make sure setup was completed
- Check if MongoDB connection works
- Refresh the page

### **❌ Categories dropdown is empty**

**Solution:**
- Same as above - setup needs to be completed
- Categories should be in database

---

## 📊 **What Gets Created**

When you run setup or seed:

**Database Collections:**
- `users` - 1 admin user
- `products` - 12 products (bags, jackets, wallets, etc.)
- `categories` - 5 categories
- `testimonials` - 4 testimonials
- `inquiries` - Empty (will fill as users submit)
- `meetings` - Empty (will fill as users schedule)

**Admin User:**
- Name: Admin User
- Email: admin@bulkleather.com
- Password: admin123 (change after login!)
- Role: admin

---

## 🎨 **What's Dynamic**

### **Public Website:**
- ✅ Products (from MongoDB)
- ✅ Categories (from MongoDB)
- ✅ Testimonials (from MongoDB)
- ✅ Form submissions (saved to MongoDB)
- ✅ Meeting scheduler (saved to MongoDB)

### **Admin Dashboard:**
- ✅ All statistics (calculated from MongoDB)
- ✅ Products management (MongoDB CRUD)
- ✅ Categories management (MongoDB CRUD)
- ✅ Inquiries (from MongoDB)
- ✅ Meetings (from MongoDB)
- ✅ Real-time updates

---

## 🔐 **Security Notes**

**After Setup:**
1. **Change admin password** via admin dashboard
2. **Keep .env.local secret** (never commit to git)
3. **Use strong JWT_SECRET** in production
4. **Rotate passwords** regularly

**For Production:**
1. Use specific IP addresses (not 0.0.0.0/0)
2. Enable MongoDB backups
3. Set up SSL/TLS
4. Use environment variables on hosting

---

## 📱 **Test Everything**

### **Customer Flow:**
1. Browse products
2. Add samples to cart
3. Submit contact form
4. Schedule a meeting

### **Admin Flow:**
1. Login to dashboard
2. See real statistics
3. View new inquiry in inquiries page
4. View new meeting in meetings page
5. Update inquiry status
6. Manage products

---

## 🎉 **You're Ready!**

Once setup is complete:
- ✅ Everything fetches from MongoDB
- ✅ No hardcoded data
- ✅ Real-time admin updates
- ✅ Forms save to database
- ✅ Sample cart integration working
- ✅ Meeting scheduler working

**Time to explore your fully dynamic wholesale leather platform!** 🚀

---

## 📞 **Need Help?**

- **MongoDB Setup**: MONGODB_ATLAS_SETUP.md
- **Backend Details**: BACKEND_SETUP.md
- **API Reference**: BACKEND_COMPLETE.md
- **Quick Start**: QUICK_START_CLOUD.md

---

**Current Status:** Everything is connected to MongoDB and fully dynamic! 🎊

