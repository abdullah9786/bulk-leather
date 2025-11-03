## BulkLeather Backend & Admin Dashboard Setup

## 🗄️ **Backend Architecture**

The backend is built using:
- **Next.js API Routes** (serverless functions)
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for admin access
- **Zod** for validation
- **TypeScript** for type safety

---

## 📦 **Installation**

### 1. Install Dependencies

```bash
npm install
```

New backend dependencies installed:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT auth tokens
- `next-auth` - Authentication
- `zod` - Schema validation
- `recharts` - Dashboard charts
- `date-fns` - Date utilities

### 2. Set Up MongoDB Atlas (Cloud)

**MongoDB Atlas Setup (Recommended):**

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Username: `bulkleather`
   - Password: Generate strong password
   - Role: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `bulkleather`

**Your connection string will look like:**
```
mongodb+srv://bulkleather:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority
```

### 3. Configure Environment Variables

Create `.env.local` file in project root:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://bulkleather:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- Replace `YOUR_PASSWORD` with your MongoDB Atlas user password
- Replace `cluster0.xxxxx` with your actual cluster name
- Keep `bulkleather` as the database name

### 4. Seed Database

Run the seeding script to populate initial data:

```bash
npm run seed
```

This will:
- Create admin user (admin@bulkleather.com / admin123)
- Import all products from `data/products.json`
- Import all categories from `data/categories.json`

---

## 🔐 **Authentication**

### Admin Login Credentials

After seeding:
- **Email**: `admin@bulkleather.com`
- **Password**: `admin123`

### Admin Dashboard URL

```
http://localhost:3000/admin/login
```

---

## 🛣️ **API Routes**

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin user

### Products
- `GET /api/products` - List all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories (public)
- `GET /api/categories/:id` - Get single category (public)
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Inquiries
- `POST /api/inquiries` - Submit inquiry (public)
- `GET /api/inquiries` - List inquiries (admin)
- `GET /api/inquiries/:id` - Get inquiry details (admin)
- `PUT /api/inquiries/:id` - Update inquiry status (admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin)

### Meetings
- `POST /api/meetings` - Schedule meeting (public)
- `GET /api/meetings` - List meetings (admin)
- `GET /api/meetings/:id` - Get meeting details (admin)
- `PUT /api/meetings/:id` - Update meeting (admin)
- `DELETE /api/meetings/:id` - Delete meeting (admin)

---

## 🗂️ **Database Models**

### User Model
```typescript
{
  name: string;
  email: string;
  password: string (hashed);
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
{
  name: string;
  category: string;
  description: string;
  material: string;
  images: string[];
  moq: number;
  priceRange: string;
  features: string[];
  colors: string[];
  sizes?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model
```typescript
{
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Inquiry Model
```typescript
{
  name: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: "bulk" | "sample" | "general" | "partnership" | "support";
  productInterest?: string;
  message: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
  status: "new" | "contacted" | "quoted" | "converted" | "closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Meeting Model
```typescript
{
  name: string;
  email: string;
  company: string;
  phone: string;
  meetingType: "consultation" | "product" | "custom" | "samples" | "partnership";
  meetingMode: "video" | "phone" | "whatsapp" | "inperson";
  date: Date;
  timeSlot: string;
  message?: string;
  sampleCartItems?: Array<{ productName: string; quantity: number }>;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎯 **Admin Dashboard Pages**

### Dashboard Overview (`/admin`)
- Statistics cards (products, inquiries, meetings)
- Recent inquiries list
- Upcoming meetings
- Quick action links

### Products Management (`/admin/products`)
- View all products in table
- Search and filter functionality
- Toggle active/inactive status
- Edit and delete products
- Add new products (coming soon)

### Categories Management (`/admin/categories`)
- View categories in grid
- Add, edit, delete categories
- Toggle active status
- Visual card-based interface

### Inquiries Management (`/admin/inquiries`)
- View all customer inquiries
- Filter by status and type
- View inquiry details modal
- Shows sample cart items
- Update inquiry status
- Mark as contacted/quoted/converted

### Meetings Management (`/admin/meetings`)
- View all scheduled meetings
- Filter by status
- See meeting details (date, time, mode)
- Shows sample cart items
- Update meeting status
- Calendar view integration (coming soon)

### Users Management (`/admin/users`)
- Manage admin users
- Add/edit/delete users
- Role management

---

## 🔒 **Authentication & Authorization**

### JWT Token Flow

1. **Login**: POST to `/api/auth/login`
2. **Receive**: JWT token + user data
3. **Store**: Token in localStorage
4. **Use**: Include in Authorization header
5. **Protected Routes**: Check token validity

### Example API Call with Auth

```typescript
const token = localStorage.getItem("admin-token");

const response = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});
```

### Middleware

- `withAuth()` - Requires valid JWT token
- `withAdminAuth()` - Requires admin role

---

## 🚀 **Getting Started**

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up MongoDB Atlas (see section above)
# - Create cluster
# - Create database user
# - Whitelist IP
# - Copy connection string

# 3. Create .env.local file
# Add your MongoDB Atlas connection string

# 4. Seed database
npm run seed

# 5. Start development server
npm run dev

# 6. Access admin dashboard
# Open: http://localhost:3000/admin/login
# Login: admin@bulkleather.com / admin123
```

---

## 📊 **Admin Dashboard Features**

### Current Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Sidebar navigation with icons
- ✅ Protected routes with authentication
- ✅ Statistics dashboard
- ✅ Products CRUD interface
- ✅ Categories management
- ✅ Inquiries management with details
- ✅ Meetings scheduling system
- ✅ Sample cart integration
- ✅ Search and filter functionality
- ✅ Status management (inquiries & meetings)

### Coming Soon
- 📅 Calendar view for meetings
- 📧 Email notifications
- 📊 Advanced analytics with charts
- 📁 File upload for product images
- 📝 Rich text editor for descriptions
- 🔄 Bulk actions (delete, update)
- 📈 Sales tracking
- 💬 Internal notes system

---

## 🔧 **Development Notes**

### File Structure

```
app/
├── api/                      # API Routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── categories/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── inquiries/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── meetings/
│       ├── route.ts
│       └── [id]/route.ts
├── admin/                    # Admin Dashboard
│   ├── layout.tsx
│   ├── page.tsx             # Dashboard
│   ├── login/page.tsx
│   ├── products/page.tsx
│   ├── categories/page.tsx
│   ├── inquiries/page.tsx
│   ├── meetings/page.tsx
│   └── users/page.tsx
models/
├── User.ts
├── Product.ts
├── Category.ts
├── Inquiry.ts
└── Meeting.ts
lib/
├── mongodb.ts               # DB connection
├── auth.ts                  # Auth utilities
└── middleware.ts            # API middleware
```

### Adding New Admin Users

```bash
# Via API (requires admin token)
POST /api/auth/register
{
  "name": "New Admin",
  "email": "newadmin@bulkleather.com",
  "password": "secure-password",
  "role": "admin"
}
```

---

## 🧪 **Testing the Backend**

### Test API Endpoints

```bash
# Get all products
curl http://localhost:3000/api/products

# Get all categories
curl http://localhost:3000/api/categories

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bulkleather.com","password":"admin123"}'

# Submit inquiry (no auth required)
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "phone": "+1234567890",
    "inquiryType": "bulk",
    "message": "I am interested in bulk orders"
  }'
```

---

## 🐛 **Troubleshooting**

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Or check docker container
docker ps | grep mongo

# Verify connection string
echo $MONGODB_URI
```

### Authentication Issues

- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET in .env.local
- Verify token expiration (7 days default)

### Seeding Errors

- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify JSON files exist in `/data` folder

---

## 📝 **Next Steps**

1. **Connect Frontend to Backend**
   - Update product fetching to use API
   - Update form submissions to use API
   - Add loading states

2. **Add File Upload**
   - AWS S3 integration
   - Image upload for products
   - Signed URL generation

3. **Email Notifications**
   - Nodemailer setup
   - Email templates
   - Auto-send on inquiry/meeting

4. **Advanced Features**
   - Export data to CSV
   - Bulk import products
   - Analytics dashboard
   - Activity logs

---

## 🎉 **You're All Set!**

Backend and admin dashboard are ready. Run `npm run seed` and login at `/admin/login`!

