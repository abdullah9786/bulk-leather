# Quick Start Guide

## Get Up and Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: **http://localhost:3000**

---

## Default Configuration

- **Default Theme**: Luxury Sand
- **Port**: 3000
- **Mock Data**: Pre-loaded with 12 products

---

## Testing the Site

### Pages to Explore:
1. **Home** (`/`) - Hero, categories, testimonials
2. **Products** (`/products`) - Browse all products with filters & quick add to cart
3. **Product Detail** (`/products/p1`) - Example product page with cart
4. **Customization** (`/customization`) - Custom manufacturing services
5. **About** (`/about`) - Company story and values
6. **Contact** (`/contact`) - Contact form with cart integration

### Features to Test:
- ✅ Shopping Cart (sample requests)
- ✅ Quick Add to Cart from product cards
- ✅ Theme Switcher (top-right palette icon)
- ✅ Mobile Menu (responsive)
- ✅ Product Filters (category, material, search)
- ✅ Grid/List View Toggle
- ✅ Form Submissions (console logs)
- ✅ Smooth Animations (scroll effects)

---

## Theme Switching

Click the **palette icon** in the header to switch between:
1. **Luxury Sand** - Light, elegant (default)
2. **Dark Elegance** - Dark, sophisticated
3. **Warm Earthy** - Warm brown tones

Your preference is saved in localStorage!

---

## Common Tasks

### Add a Product
Edit `/data/products.json` and add a new product object

### Change Contact Info
Update in:
- `/components/layout/Footer.tsx`
- `/app/contact/page.tsx`

### Customize Theme Colors
Edit `/contexts/ThemeContext.tsx` → `themeConfig` object

### Build for Production
```bash
npm run build
npm run start
```

---

## Need Help?

Check the main [README.md](./README.md) for full documentation.

---

**Enjoy your new premium leather wholesale website! 🎉**

