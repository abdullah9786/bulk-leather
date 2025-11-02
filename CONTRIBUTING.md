# Contributing to BulkLeather

Thank you for your interest in contributing to the BulkLeather project! This guide will help you get started.

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git
- Code editor (VS Code recommended)

### Getting Started
```bash
# Clone the repository
cd bulk-leather

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
bulk-leather/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── products/          # Products pages
│   ├── sample-purchase/   # Sample purchase page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Textarea.tsx
├── contexts/
│   └── ThemeContext.tsx   # Theme management
├── data/                  # Mock JSON data
│   ├── products.json
│   ├── categories.json
│   └── testimonials.json
├── lib/
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## 🎨 Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing
- Use type inference where possible

```typescript
// ✅ Good
interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
  // ...
};

// ❌ Bad
export const Button = (props: any) => {
  // ...
};
```

### React Components
- Use functional components
- Use proper prop typing
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

```typescript
// ✅ Good - Single purpose, typed
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <h3>{product.name}</h3>
      {/* ... */}
    </Card>
  );
}

// ❌ Bad - Mixed concerns
export function ProductPage() {
  // 200 lines of mixed logic, rendering, and styles
}
```

### Styling with Tailwind
- Use Tailwind utility classes
- Use CSS variables for theme colors
- Create reusable components for repeated patterns
- Use responsive prefixes (sm:, md:, lg:)

```tsx
// ✅ Good - Using CSS variables for theme
<div className="bg-[var(--color-card)] text-[var(--color-text)]">
  Content
</div>

// ✅ Good - Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* ... */}
</div>

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black">
  Content
</div>
```

### Animations
- Use Framer Motion for animations
- Keep animations subtle and performant
- Use `whileInView` for scroll animations
- Set `viewport={{ once: true }}` to avoid re-triggering

```tsx
// ✅ Good
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// ❌ Bad - Too aggressive
<motion.div animate={{ rotate: 360, scale: 2 }}>
  Content
</motion.div>
```

## 📝 Adding New Features

### Adding a New Page
1. Create folder in `app/` directory
2. Create `page.tsx` file
3. Add to navigation in `components/layout/Header.tsx`
4. Update sitemap if needed

```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Your content */}
      </div>
    </div>
  );
}
```

### Adding a New Component
1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Use proper naming convention (PascalCase)
4. Export as named export

```typescript
// components/ui/NewComponent.tsx
interface NewComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function NewComponent({ title, children }: NewComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Adding Products to Mock Data
Edit `data/products.json`:

```json
{
  "id": "p13",
  "name": "Product Name",
  "category": "category-slug",
  "description": "Detailed description",
  "material": "Leather Type",
  "images": [
    "https://images.unsplash.com/photo-xxx?w=800",
    "https://images.unsplash.com/photo-yyy?w=800"
  ],
  "moq": 50,
  "priceRange": "$80 - $120",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "colors": ["Black", "Brown", "Tan"],
  "sizes": ["S", "M", "L"] // optional
}
```

### Adding a New Theme
1. Edit `contexts/ThemeContext.tsx`
2. Add to `themeConfig` object
3. Add to `ThemeType` in `types/index.ts`
4. Update theme switcher in Header

```typescript
// contexts/ThemeContext.tsx
export const themeConfig = {
  // ... existing themes
  newTheme: {
    name: "New Theme Name",
    bg: "#FFFFFF",
    secondary: "#F5F5F5",
    text: "#000000",
    body: "#666666",
    accent: "#D6A76C",
    accentHover: "#C89654",
    card: "#FFFFFF",
    glow: "rgba(214,167,108,0.35)",
  },
};
```

## 🧪 Testing

### Before Submitting
- [ ] Test on mobile, tablet, and desktop
- [ ] Test all three themes
- [ ] Check for console errors
- [ ] Verify forms work correctly
- [ ] Test navigation
- [ ] Check responsive images
- [ ] Verify animations are smooth
- [ ] Test keyboard navigation

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Bug Reports

### Create Good Bug Reports
Include:
1. **Description** - What happened?
2. **Steps to Reproduce** - How to recreate?
3. **Expected Behavior** - What should happen?
4. **Screenshots** - Visual evidence
5. **Environment** - Browser, OS, device
6. **Console Errors** - Any error messages?

Example:
```
Bug: Theme switcher not working on mobile

Steps to Reproduce:
1. Open site on mobile device
2. Tap palette icon
3. Select different theme

Expected: Theme should change
Actual: Nothing happens

Environment: iPhone 12, Safari 15.2
Console: TypeError: localStorage is not defined
```

## 🎯 Feature Requests

When suggesting features:
1. Describe the feature clearly
2. Explain the use case
3. Consider implementation complexity
4. Think about backend integration (if applicable)

## 📋 Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Write clean, documented code
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Include screenshots if UI changes

### Commit Message Format
```
Type: Brief description

Longer description if needed

Types:
- Add: New feature
- Fix: Bug fix
- Update: Changes to existing feature
- Refactor: Code restructuring
- Style: Formatting, styling
- Docs: Documentation changes
```

## 🔍 Code Review

### What We Look For
- ✅ Code follows project standards
- ✅ TypeScript types are proper
- ✅ Responsive design works
- ✅ Animations are smooth
- ✅ No console errors
- ✅ Accessibility maintained
- ✅ Performance not degraded

## 🎨 Design Guidelines

### Colors
- Use CSS variables for theme colors
- Maintain WCAG AA contrast ratios
- Test in all three themes

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Use responsive font sizes (clamp)

### Spacing
- Use Tailwind spacing scale
- Maintain consistent gaps and padding
- Use container for max-width

### Components
- Reusable and composable
- Properly typed props
- Accessible (ARIA, keyboard)
- Responsive by default

## 🚨 Common Mistakes to Avoid

### ❌ Don't
- Hardcode colors instead of using CSS variables
- Use inline styles for theming
- Forget mobile responsiveness
- Skip TypeScript types
- Add dependencies without discussion
- Commit `.env.local` or secrets
- Use `any` type in TypeScript
- Create overly complex components

### ✅ Do
- Use CSS variables for theme colors
- Test on multiple devices/browsers
- Write proper TypeScript types
- Keep components focused
- Use existing utility functions
- Follow established patterns
- Comment complex logic
- Optimize images

## 📚 Helpful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com/)
- [Can I Use](https://caniuse.com/)

## 💬 Questions?

If you have questions:
1. Check the README.md
2. Check PROJECT_SUMMARY.md
3. Look at existing code examples
4. Ask in project discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to BulkLeather! 🎉

