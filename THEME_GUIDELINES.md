# Theme Adaptability Guidelines

## Overview
BulkLeather uses a dynamic theme system that allows users to switch between different visual themes. All UI components must use CSS variables to ensure they adapt to theme changes automatically.

## Available CSS Variables

### Color Variables
```css
--color-bg          /* Main background color */
--color-secondary   /* Secondary background (lighter/darker than bg) */
--color-text        /* Primary text color (high contrast) */
--color-body        /* Body text color (medium contrast) */
--color-accent      /* Accent color (buttons, highlights) */
--color-accent-hover /* Accent hover state */
--color-card        /* Card/container background */
--color-glow        /* Glow effects (RGBA format) */
```

## Available Themes

### 1. Luxury Sand (Default)
- Light, warm, sandy tones
- Professional and elegant
- High readability

### 2. Dark Elegance
- Dark theme with golden accents
- Modern and sophisticated
- Easy on the eyes

### 3. Warm Earth
- Deep brown earth tones
- Craftsmanship focused
- Warm and inviting

## Usage Guidelines

### ✅ DO: Use CSS Variables

```tsx
// Correct - Uses theme variables
<div className="bg-[var(--color-bg)]">
  <h1 className="text-[var(--color-text)]">Title</h1>
  <p className="text-[var(--color-body)]">Description</p>
  <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]">
    Click Me
  </button>
</div>
```

### ❌ DON'T: Use Hardcoded Colors

```tsx
// Wrong - Hardcoded colors won't adapt to themes
<div className="bg-gray-50">
  <h1 className="text-gray-900">Title</h1>
  <p className="text-gray-600">Description</p>
  <button className="bg-amber-600 hover:bg-amber-700">
    Click Me
  </button>
</div>
```

## Common Patterns

### Background Colors
```tsx
// Main page background
<div className="bg-[var(--color-bg)]">

// Card/container background
<div className="bg-[var(--color-card)]">

// Secondary sections
<div className="bg-[var(--color-secondary)]">
```

### Text Colors
```tsx
// Headings and important text
<h1 className="text-[var(--color-text)]">

// Body text and descriptions
<p className="text-[var(--color-body)]">

// Muted text
<span className="text-[var(--color-body)]/70">
```

### Accent Colors
```tsx
// Primary buttons
<button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]">

// Accent text
<span className="text-[var(--color-accent)]">

// Accent backgrounds (with opacity)
<div className="bg-[var(--color-accent)]/20">
```

### Borders
```tsx
// Subtle borders
<div className="border border-[var(--color-secondary)]">

// Accent borders
<div className="border border-[var(--color-accent)]">
```

### Gradients
```tsx
// Accent gradient
<div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)]">
```

## Component Examples

### Card Component
```tsx
<div className="bg-[var(--color-card)] border border-[var(--color-secondary)] rounded-lg p-6 shadow-md">
  <h3 className="text-[var(--color-text)] font-bold mb-2">Card Title</h3>
  <p className="text-[var(--color-body)]">Card description text</p>
  <button className="mt-4 bg-[var(--color-accent)] text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

### Hero Section
```tsx
<div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white py-16">
  <h1 className="text-4xl font-bold mb-4">Hero Title</h1>
  <p className="text-white/90">Hero description</p>
</div>
```

### Filter/Tab Buttons
```tsx
<button
  className={`px-4 py-2 rounded-full transition-all ${
    isActive
      ? "bg-[var(--color-accent)] text-white shadow-md"
      : "bg-[var(--color-secondary)] text-[var(--color-body)] hover:bg-[var(--color-accent)]/20"
  }`}
>
  Filter Option
</button>
```

### Input Fields
```tsx
<input
  className="px-4 py-2 border border-[var(--color-secondary)] bg-[var(--color-card)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
  placeholder="Enter text..."
/>
```

### Loading Spinner
```tsx
<div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
```

## Special Cases

### White Text Override
When using accent gradients or dark backgrounds, white text is acceptable:
```tsx
<div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)]">
  <p className="text-white">This is fine because the background is accent-colored</p>
</div>
```

### Black Overlays
For image overlays and lightbox backgrounds, black with opacity is acceptable:
```tsx
<div className="absolute inset-0 bg-black/50">
  <!-- Overlay content -->
</div>
```

### External Images
Image content doesn't need to be theme-adaptive:
```tsx
<img src="product.jpg" alt="Product" className="w-full h-auto" />
```

## Testing Themes

### Manual Testing
1. Open your application
2. Navigate to the page you're working on
3. Use the theme switcher in the header
4. Verify all elements look good in all three themes:
   - Luxury Sand
   - Dark Elegance
   - Warm Earth

### Checklist
- [ ] All text is readable (good contrast)
- [ ] Buttons are visible and hover states work
- [ ] Borders are visible but not overwhelming
- [ ] Cards/containers have proper backgrounds
- [ ] Icons match the text color scheme
- [ ] Loading states use accent color
- [ ] Forms and inputs are usable
- [ ] No hardcoded gray/amber/blue colors remain

## Adding New Themes

To add a new theme, update `contexts/ThemeContext.tsx`:

```typescript
export const themeConfig = {
  // Existing themes...
  
  newThemeName: {
    name: "Display Name",
    bg: "#HEXCODE",           // Main background
    secondary: "#HEXCODE",    // Secondary background
    text: "#HEXCODE",         // Primary text (high contrast)
    body: "#HEXCODE",         // Body text (medium contrast)
    accent: "#HEXCODE",       // Accent/highlight color
    accentHover: "#HEXCODE",  // Accent hover state
    card: "#HEXCODE",         // Card backgrounds
    glow: "rgba(R,G,B,A)",   // Glow effects
  },
};
```

Then update the `ThemeType` in `types/index.ts`:
```typescript
export type ThemeType = "luxurySand" | "darkElegance" | "warmEarth" | "newThemeName";
```

## Files Already Theme-Adaptive

✅ Components:
- Header
- Footer
- All buttons (via Button component)
- All inputs (via Input component)
- Cart drawer
- Modals
- Scheduler
- Product cards
- Category cards

✅ Pages:
- Home page
- Products page
- Product detail page
- Customization page
- About page
- Contact page
- Schedule Meeting page
- **Gallery page** ⭐ (Updated)
- My Enquiries page
- My Meetings page

## Files That May Need Updates

When creating new pages or components, always use CSS variables from the start. Common locations that might have hardcoded colors:

- Admin dashboard pages
- New feature pages
- Custom modals
- Special sections
- Landing pages

## Quick Reference

**Main Backgrounds**: `bg-[var(--color-bg)]`  
**Cards**: `bg-[var(--color-card)]`  
**Secondary BG**: `bg-[var(--color-secondary)]`  
**Headings**: `text-[var(--color-text)]`  
**Body Text**: `text-[var(--color-body)]`  
**Accent**: `bg-[var(--color-accent)]` / `text-[var(--color-accent)]`  
**Borders**: `border-[var(--color-secondary)]`  
**Hover Accent**: `hover:bg-[var(--color-accent-hover)]`  

## Need Help?

If unsure about which color variable to use:
1. Check similar components in other pages
2. Test in all three themes
3. Prioritize readability and contrast
4. When in doubt, use `--color-body` for text

## Future Considerations

- Consider adding more themes for holidays/special events
- Add theme preview before applying
- Consider user-custom theme builder
- Add theme presets for different industries
- Consider accessibility themes (high contrast)

