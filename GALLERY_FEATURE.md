# Gallery Feature Documentation

## Overview
A beautiful image and video gallery system that showcases factory tours, manufacturing processes, worker skills, and products. The gallery includes both a public-facing page with lightbox viewing and a comprehensive admin dashboard for content management.

## Features

### Public Gallery (`/gallery`)
- **Beautiful Grid Layout**: Responsive grid with smooth animations
- **Category Filtering**: Filter by Factory Tour, Manufacturing, Workers, Products, or Other
- **Media Type Filtering**: Show only images, only videos, or both
- **Lightbox View**: Click any item to open in full-screen lightbox
- **Navigation**: Previous/Next buttons in lightbox for easy browsing
- **Video Support**: Automatic play button overlay for videos
- **Tags**: Display relevant tags for each item
- **Responsive Design**: Optimized for all screen sizes

### Admin Dashboard (`/admin/gallery`)
- **CRUD Operations**: Create, Read, Update, Delete gallery items
- **Media Management**: Support for both images and videos
- **Categorization**: Organize content by type
- **Active/Inactive Toggle**: Control visibility without deleting
- **Display Order**: Manual sorting with display order field
- **Search & Filter**: Search by title, description, or tags
- **Statistics**: Real-time stats showing total items, images, videos, and active items
- **Thumbnail Support**: Optional thumbnail images for videos
- **Tag Management**: Add multiple tags separated by commas

## Database Schema

### Gallery Model (`models/Gallery.ts`)
```typescript
interface IGallery {
  _id: string;
  title: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string; // For videos
  category: "factory-tour" | "manufacturing" | "workers" | "products" | "other";
  tags?: string[];
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### GET `/api/gallery`
**Public Access** (shows only active items) | **Admin Access** (shows all items)
- **Query Parameters**:
  - `category` - Filter by category
  - `mediaType` - Filter by media type (image/video)
  - `admin=true` - Show all items including inactive (for admin dashboard)

**Response**:
```json
{
  "success": true,
  "data": [/* array of gallery items */]
}
```

### POST `/api/gallery` (Admin Only)
Create a new gallery item.

**Request Body**:
```json
{
  "title": "Leather Cutting Process",
  "description": "Our skilled workers precisely cutting premium leather",
  "mediaType": "image",
  "mediaUrl": "https://example.com/image.jpg",
  "thumbnailUrl": "https://example.com/thumb.jpg", // Optional
  "category": "manufacturing",
  "tags": ["leather", "cutting", "precision"],
  "isActive": true,
  "displayOrder": 1
}
```

### PUT `/api/gallery/[id]` (Admin Only)
Update an existing gallery item.

**Request Body**: Same as POST, all fields optional

### DELETE `/api/gallery/[id]` (Admin Only)
Delete a gallery item permanently.

## Components

### Public Components
- **`app/gallery/page.tsx`**: Main gallery page with filtering and lightbox
  - Grid layout with Framer Motion animations
  - Category pills with item counts
  - Media type dropdown filter
  - Full-screen lightbox with navigation
  - Responsive design

### Admin Components
- **`app/admin/gallery/page.tsx`**: Admin dashboard for gallery management
  - Stats cards (total, images, videos, active)
  - Search and filter controls
  - Grid view of all items with preview
  - Quick actions (show/hide, edit, delete)
  
- **`components/admin/GalleryModal.tsx`**: Modal for adding/editing items
  - Media type selection (image/video)
  - Form validation
  - Thumbnail URL support for videos
  - Tag input with comma separation
  - Display order control
  - Active/inactive toggle

## Categories

1. **Factory Tour** (`factory-tour`)
   - Showcases different areas of the factory
   - Overall facility views
   - Workspace organization

2. **Manufacturing Process** (`manufacturing`)
   - Step-by-step production processes
   - Machinery in action
   - Quality control procedures

3. **Workers & Skills** (`workers`)
   - Skilled craftsmen at work
   - Hand-crafted techniques
   - Team collaboration

4. **Products** (`products`)
   - Finished leather products
   - Product details and features
   - Design variations

5. **Other** (`other`)
   - Miscellaneous content
   - Company events
   - Behind-the-scenes

## Usage Guide

### Adding a New Gallery Item (Admin)

1. Navigate to Admin Dashboard → Gallery
2. Click "Add New Item"
3. Select media type (Image or Video)
4. Fill in required fields:
   - Title: Descriptive name
   - Media URL: Direct link to image/video
   - Category: Select appropriate category
5. Optional fields:
   - Description: Brief explanation
   - Thumbnail URL: For videos (recommended)
   - Tags: Comma-separated keywords
   - Display Order: Lower numbers appear first
6. Toggle "Show in gallery" to control visibility
7. Click "Add Item"

### Managing Existing Items

- **Show/Hide**: Click the eye icon to toggle visibility
- **Edit**: Click the pencil icon to modify details
- **Delete**: Click the trash icon to permanently remove

### Using the Public Gallery

1. Visit `/gallery` on the website
2. Browse all items in the grid layout
3. Use category pills to filter by type
4. Use media type dropdown for images/videos only
5. Click any item to open lightbox
6. Navigate with arrow buttons or keyboard
7. Close with X button or clicking outside

## Design Features

### Public Gallery
- **Hero Section**: Gradient background with page title
- **Sticky Filters**: Always accessible while scrolling
- **Smooth Animations**: Framer Motion for grid items
- **Hover Effects**: Scale and overlay effects
- **Lightbox**: Full-screen viewing with backdrop blur
- **Video Controls**: Autoplay in lightbox with native controls

### Admin Dashboard
- **Card Layout**: Clean, modern card design
- **Live Preview**: See images/videos in cards
- **Status Badges**: Visual indicators for active/inactive
- **Quick Stats**: At-a-glance metrics
- **Responsive Tables**: Mobile-optimized layouts

## File Structure

```
/app
  /gallery
    page.tsx              # Public gallery page
  /admin
    /gallery
      page.tsx            # Admin gallery management
  /api
    /gallery
      route.ts            # GET (public), POST (admin)
      /[id]
        route.ts          # PUT, DELETE (admin)

/components
  /admin
    GalleryModal.tsx      # Add/Edit modal

/models
  Gallery.ts              # MongoDB schema
```

## Navigation

- **Public Header**: Gallery link added between Customization and Schedule Meeting
- **Admin Sidebar**: Gallery link with Image icon, positioned after Meetings

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB with Mongoose
- **API**: Next.js API Routes
- **Validation**: Zod

## Security

- Public API routes show only active items
- Admin routes require authentication token
- Role-based access control (admin only)
- Input validation with Zod schemas

## Future Enhancements

- [ ] Direct file upload integration (currently URL-based)
- [ ] Bulk upload functionality
- [ ] Video thumbnail auto-generation
- [ ] Gallery collections/albums
- [ ] Social sharing buttons
- [ ] Download options for images
- [ ] Advanced search with full-text indexing
- [ ] Lazy loading for large galleries
- [ ] Image optimization pipeline

## Testing Checklist

- [ ] Add image item via admin dashboard
- [ ] Add video item with thumbnail
- [ ] View items in public gallery
- [ ] Test category filtering
- [ ] Test media type filtering
- [ ] Open lightbox and navigate
- [ ] Toggle item active/inactive
- [ ] Edit existing item
- [ ] Delete item
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify only active items show publicly
- [ ] Test keyboard navigation in lightbox

## Console Logs

Gallery operations log useful information:

```
Admin Actions:
✅ Gallery item created: [item_id]
✅ Gallery item updated: [item_id]
✅ Gallery item deleted: [item_id]
```

## Related Files

- `models/Gallery.ts` - Database schema
- `app/api/gallery/route.ts` - Public GET, Admin POST
- `app/api/gallery/[id]/route.ts` - Admin PUT, DELETE
- `app/gallery/page.tsx` - Public gallery page
- `app/admin/gallery/page.tsx` - Admin management page
- `components/admin/GalleryModal.tsx` - Add/Edit modal
- `components/layout/Header.tsx` - Navigation link
- `app/admin/layout.tsx` - Admin sidebar link

