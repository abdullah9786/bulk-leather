# BulkLeather - Premium Wholesale Leather Goods

A modern, elegant Next.js website for a wholesale leather products business. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🌟 Features

### Current Implementation (Frontend)

- **Premium UI/UX**: Luxury-focused design with three switchable themes
- **Responsive Design**: Fully responsive across all device sizes
- **Theme Switcher**: Three beautiful themes with localStorage persistence
  - Luxury Sand (default)
  - Dark Elegance
  - Warm Earthy Craftsmanship
- **Product Catalog**: Comprehensive product listing with filtering and search
- **Product Details**: Detailed product pages with image galleries and quote forms
- **Shopping Cart**: Beautiful cart system for sample requests with persistent storage
- **Quick Add to Cart**: Add samples directly from product cards
- **Contact System**: Multi-channel contact options (phone, email, WhatsApp)
- **Smooth Animations**: Framer Motion animations throughout
- **SEO Optimized**: Meta tags and semantic HTML structure

### Pages

1. **Home** - Hero section, featured categories, brand story, testimonials
2. **Products** - Grid/list view, filters, quick add to sample cart
3. **Product Details** - Image gallery, specifications, add to cart, quote form
4. **Customization** - Detailed custom manufacturing services, process, pricing
5. **About** - Company story, values, timeline, statistics
6. **Contact** - Multi-method contact with form, shows cart items in inquiry

## 🎨 Design Themes

### Luxury Sand (Default)
- Background: `#FAF8F5`
- Accent: `#D6A76C` (Matte Gold)
- Text: `#3A2D28` (Deep Brown)

### Dark Elegance
- Background: `#1A1816` (Black)
- Accent: `#D6A76C` (Gold)
- Text: `#F5F1EA` (Beige)

### Warm Earthy Craftsmanship
- Background: `#2C1810` (Deep Brown)
- Accent: `#D6A76C` (Gold)
- Text: `#F2E8DC` (Tan)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd bulk-leather
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
bulk-leather/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── products/                 # Products listing & detail pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── cart/                     # Shopping cart components
│   │   ├── CartButton.tsx        # Cart icon with badge
│   │   └── CartDrawer.tsx        # Sliding cart drawer
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Header with navigation & cart
│   │   └── Footer.tsx            # Footer
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Textarea.tsx
├── contexts/
│   ├── CartContext.tsx           # Cart state management
│   └── ThemeContext.tsx          # Theme management
├── data/                         # Mock data (JSON)
│   ├── products.json             # Product catalog
│   ├── categories.json           # Product categories
│   └── testimonials.json         # Customer testimonials
├── lib/
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript type definitions
├── public/                       # Static assets
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🎯 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Optimization**: Next/Image

## 📝 Mock Data

The site currently uses mock JSON data located in the `/data` directory:

- `products.json` - 12 sample products across 5 categories
- `categories.json` - 5 product categories
- `testimonials.json` - 4 customer testimonials

## 🎨 Customization

### Changing Themes

Themes are defined in `contexts/ThemeContext.tsx`. To modify or add themes:

1. Edit the `themeConfig` object
2. Add new theme type to `types/index.ts`
3. Update the theme switcher in `components/layout/Header.tsx`

### Adding Products

Edit `/data/products.json` to add new products. Each product requires:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "category": "category-slug",
  "description": "Product description",
  "material": "Leather type",
  "images": ["url1", "url2"],
  "moq": 50,
  "priceRange": "$XX - $XX",
  "features": ["feature1", "feature2"],
  "colors": ["color1", "color2"],
  "sizes": ["S", "M", "L"] // optional
}
```

### Updating Contact Information

Update contact details in:
- `components/layout/Footer.tsx`
- `app/contact/page.tsx`

## 🔮 Future Backend Integration

This frontend is designed for easy backend integration. Planned features:

### Backend (Node.js + Express/NestJS)

- RESTful API for all CRUD operations
- MongoDB/PostgreSQL database
- JWT authentication for admin panel
- AWS S3 for image uploads
- Input validation with Zod/Joi
- API documentation with Swagger

### Admin Dashboard

- Secure login system
- Product management (CRUD)
- Category management
- Inquiry and sample request tracking
- Order management
- Image upload interface
- Analytics dashboard

### API Endpoints (Planned)

```
POST   /api/auth/login              # Admin login
GET    /api/products                # List products
GET    /api/products/:id            # Product details
POST   /api/products                # Create product (Admin)
PUT    /api/products/:id            # Update product (Admin)
DELETE /api/products/:id            # Delete product (Admin)
GET    /api/categories              # List categories
POST   /api/inquiries               # Submit inquiry
POST   /api/samples                 # Submit sample request
GET    /api/samples                 # List samples (Admin)
POST   /api/uploads/sign            # Get signed S3 URL
```

## 🔒 Environment Variables (For Future Backend)

Create a `.env.local` file:

```env
# Database
DATABASE_URL=your_database_url

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region

# JWT
JWT_SECRET=your_jwt_secret

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# WhatsApp Business API (optional)
WHATSAPP_API_KEY=your_api_key
```

## 📱 Progressive Enhancement

The site includes:

- Lazy loading for images
- Code splitting for optimal performance
- SEO-friendly meta tags
- Accessibility features (ARIA labels, semantic HTML)
- Mobile-first responsive design

## 🐛 Known Limitations

1. Form submissions currently log to console (no backend)
2. Product images use Unsplash placeholders
3. No actual payment processing
4. Google Maps uses example coordinates
5. WhatsApp link uses placeholder number

## 🤝 Contributing

When adding new features:

1. Follow existing code structure
2. Use TypeScript for type safety
3. Maintain responsive design principles
4. Test across all three themes
5. Add appropriate animations with Framer Motion

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For questions or support:
- Email: inquiry@houseoflamode.com.com
- Phone: +1 (234) 567-890
- WhatsApp: +1 (234) 567-890

## 🚧 Development Roadmap

### Phase 1 - Frontend ✅ (Current)
- [x] Next.js setup with TypeScript
- [x] Theme system with 3 themes
- [x] All pages (Home, Products, About, Contact, Sample Purchase)
- [x] Responsive design
- [x] Animations with Framer Motion
- [x] Mock data integration

### Phase 2 - Backend (Next)
- [ ] RESTful API development
- [ ] Database setup and models
- [ ] Authentication system
- [ ] File upload to S3
- [ ] Email notifications
- [ ] API documentation

### Phase 3 - Admin Dashboard (Future)
- [ ] Admin panel UI
- [ ] Product/Category CRUD
- [ ] Order management
- [ ] Analytics dashboard
- [ ] User management
- [ ] Content management

### Phase 4 - Enhancements (Future)
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Built with ❤️ for wholesale leather excellence**

