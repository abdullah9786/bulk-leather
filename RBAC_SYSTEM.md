# 🔐 Role-Based Access Control (RBAC) System

## ✅ **Access Control Implemented**

Your application now has proper role-based access control separating regular users from admin users.

---

## 👥 **User Roles**

### **1. User (Customer)** - Default
- **Can Access:**
  - ✅ All public pages (home, products, about, contact)
  - ✅ Sign in with Google
  - ✅ Add samples to cart
  - ✅ Checkout and place orders
  - ✅ View their own orders (`/my-orders`)
  - ✅ Schedule meetings
  - ✅ Submit inquiries

- **Cannot Access:**
  - ❌ Admin dashboard (`/admin/*`)
  - ❌ Admin login page
  - ❌ Manage products/categories
  - ❌ View other users' orders

### **2. Admin** - Privileged
- **Can Access:**
  - ✅ Everything users can access
  - ✅ Admin dashboard (`/admin`)
  - ✅ Manage products
  - ✅ Manage categories
  - ✅ View all orders
  - ✅ View all inquiries
  - ✅ View all meetings
  - ✅ Manage users

- **Special Access:**
  - Separate login system (`/admin/login`)
  - JWT-based authentication
  - Full CRUD operations

---

## 🔒 **Authentication Systems**

### **For Regular Users (Google OAuth)**

**Sign In Method:**
- Google OAuth via NextAuth
- One-click sign in
- Session-based

**Purpose:**
- Checkout and place orders
- Track order history
- Sync cart across devices

**Access Level:**
- Public pages
- Checkout
- My Orders
- No admin access

### **For Admin Users (JWT)**

**Sign In Method:**
- Email/password login
- JWT token authentication
- Admin-specific login page

**Purpose:**
- Manage entire platform
- View all data
- CRUD operations

**Access Level:**
- Full admin dashboard
- All management features
- View all orders/inquiries/meetings

---

## 🛡️ **Protection Levels**

### **Public Routes** - No Auth Required
```
/ (home)
/products
/products/[id]
/about
/customization
/contact
```

### **User Routes** - Google Auth Required
```
/checkout         → Requires Google sign-in
/my-orders        → Requires Google sign-in
```

### **Admin Routes** - Admin JWT Required
```
/admin            → Admin role + JWT token
/admin/*          → All admin pages
```

---

## 🔐 **How It Works**

### **User Sign In Flow:**

```
1. User clicks "Sign In" or "Checkout Now"
   ↓
2. Redirected to /auth/signin
   ↓
3. Click "Continue with Google"
   ↓
4. Google authentication
   ↓
5. User created/found in database
   ↓ (Role: "user" assigned)
6. Session created
   ↓
7. Cart synced to database
   ↓
8. Redirected back to original page
```

### **Admin Login Flow:**

```
1. Admin goes to /admin/login
   ↓
2. Enter email/password
   ↓
3. JWT token generated
   ↓
4. Token + user data stored in localStorage
   ↓ (Role: "admin" required)
5. Access granted to dashboard
```

### **Access Denial:**

```
User tries to access /admin
   ↓
Check localStorage for admin token
   ↓
If no token → Redirect to /admin/login
   ↓
If has token but role != "admin"
   ↓
Alert: "Access Denied: Admin privileges required"
   ↓
Redirect to home page
```

---

## 🎯 **User Menu Component**

Added to header for all logged-in users:

**Shows:**
- User's initial in circle avatar
- Dropdown menu with:
  - User name and email
  - "My Orders" link
  - "Sign Out" button

**States:**
- Not logged in: "Sign In" button
- Logged in: User avatar with dropdown
- Loading: Skeleton loader

---

## 📍 **My Orders Page** (`/my-orders`)

New page for users to track their orders:

**Features:**
- View all their sample orders
- See order status
- Track delivery
- View ordered items
- See payment method
- Shipping address
- Special offers (if any)

**Access:**
- Only logged-in users
- Users only see their own orders
- Redirects to sign-in if not logged in

---

## 🔧 **Implementation Details**

### **Google OAuth (NextAuth):**
- Creates user with `role: "user"` by default
- Password field empty (not needed for OAuth)
- Email used as unique identifier
- Session includes user ID and role

### **Admin Dashboard:**
- Checks localStorage for JWT token
- Validates user role is "admin"
- Denies access if role is "user"
- Redirects with alert message

### **API Endpoints:**
- `/api/orders` - User's own orders (authenticated)
- `/api/admin/orders` - All orders (admin only)
- `/api/cart` - User's cart (authenticated)

---

## 🎨 **UI Updates**

### **Header Navigation:**

**Before:**
```
Logo | Nav Links | Cart | Theme | Menu
```

**After:**
```
Logo | Nav Links | User Avatar ▼ | Cart | Theme | Menu
```

### **User Dropdown Menu:**
- User name and email
- "My Orders" → `/my-orders`
- "Sign Out" (red text)

---

## 🔑 **Role Assignment**

### **Regular Users:**
- Automatically assigned `role: "user"`
- Created via Google OAuth sign-in
- Cannot be changed to admin via UI

### **Admin Users:**
- Created via seed script or `/api/auth/register`
- Assigned `role: "admin"`
- Can access admin dashboard
- Can also use Google OAuth (if same email)

### **Promoting User to Admin:**

Via MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

Or via API (create admin register endpoint if needed)

---

## 🎯 **Access Control Matrix**

| Feature | Guest | User (Logged In) | Admin |
|---------|-------|------------------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ✅ | ✅ |
| Checkout | ❌ | ✅ | ✅ |
| My Orders | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Manage Products | ❌ | ❌ | ✅ |
| View All Orders | ❌ | ❌ | ✅ |

---

## 🔒 **Security Enhancements**

### **User Authentication:**
- ✅ Google OAuth 2.0
- ✅ Session management (NextAuth)
- ✅ Server-side session validation
- ✅ Secure cookies (httpOnly)
- ✅ CSRF protection

### **Admin Authentication:**
- ✅ Separate login system
- ✅ JWT tokens
- ✅ Role validation on every request
- ✅ Password hashing (bcrypt)

### **Route Protection:**
- ✅ Checkout requires authentication
- ✅ My Orders requires authentication
- ✅ Admin routes require admin role
- ✅ API endpoints validate permissions

---

## 🧪 **Testing RBAC**

### **Test as Regular User:**
1. Sign in with Google
2. ✅ Can checkout
3. ✅ Can view my orders
4. Try to access `/admin`
5. ❌ Should get "Access Denied" alert
6. ❌ Redirected to home page

### **Test as Admin:**
1. Go to `/admin/login`
2. Login with admin credentials
3. ✅ Can access all admin pages
4. ✅ Can manage products/categories
5. ✅ Can view all orders
6. Logout from admin
7. Sign in with Google (if admin email)
8. ✅ Can also use public features

---

## 🎊 **Complete Access Control**

Your application now has:
- ✅ Two separate authentication systems
- ✅ Role-based access control
- ✅ Protected admin routes
- ✅ User order tracking
- ✅ Proper permission checks
- ✅ Access denial handling
- ✅ User menu in header
- ✅ Sign out functionality

**Users and admins are now properly separated!** 🚀

---

## 📝 **Key Points**

1. **Google OAuth** = For customers (checkout, orders)
2. **Admin Login** = For admin dashboard
3. **Role Check** = Prevents users from accessing admin
4. **Two Auth Systems** = Separate but can coexist
5. **Session vs JWT** = Different purposes

---

## ⚠️ **Important Notes**

- Admin users can also sign in with Google (if they use same email)
- Regular users will get role="user" automatically
- To create admin users, use admin registration API or seed script
- Admin dashboard checks role on every page load
- Cart syncs only for authenticated users

---

**Your RBAC system is complete and secure!** 🔐

