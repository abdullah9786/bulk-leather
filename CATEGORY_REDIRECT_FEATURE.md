# Category Slug Redirect Feature

## Overview
When admins change a category slug, they can now choose whether to create an automatic redirect from the old URL to the new one. This prevents broken links and maintains SEO value.

## How It Works

### For Admins

1. **Edit a Category**
   - Go to Admin Dashboard → Categories
   - Click "Edit" on any category

2. **Change the Slug**
   - When you modify the slug field, a blue notification box appears
   - Checkbox: "Create redirect from old URL"
   - **Default**: Checkbox is checked (recommended)

3. **Redirect Option**
   ```
   ┌─────────────────────────────────────────────────┐
   │ ✓ Create redirect from old URL                  │
   │                                                  │
   │ Automatically redirect /categories/old-slug     │
   │ to /categories/new-slug                         │
   │                                                  │
   │ ✓ Recommended to prevent broken links and       │
   │   maintain SEO                                   │
   └─────────────────────────────────────────────────┘
   ```

4. **Options**
   - **Checked** (default): Creates a redirect
   - **Unchecked**: No redirect, old links will break

5. **Save**
   - Category updates with new slug
   - If redirect option was checked, redirect is created
   - Success message confirms redirect creation

### For Users

Users accessing old URLs are automatically redirected:
- User visits: `/categories/old-bags`
- System checks: Is there a redirect?
- System redirects: `/categories/leather-bags`
- Seamless experience, no broken links!

## Technical Implementation

### Database Schema

#### Redirect Model (`models/Redirect.ts`)
```typescript
{
  fromSlug: string,      // Old slug (e.g., "old-bags")
  toSlug: string,        // New slug (e.g., "leather-bags")
  type: "category",      // Type of redirect
  isActive: boolean,     // Can be disabled
  createdAt: Date,
  updatedAt: Date
}
```

### API Changes

#### Update Category API (`/api/categories/[id]`)
**Request Payload:**
```json
{
  "name": "Leather Bags",
  "slug": "leather-bags",
  "description": "...",
  "image": "...",
  "createRedirect": true,  // New field
  "oldSlug": "old-bags"    // New field
}
```

**Process:**
1. Validates category data
2. If `createRedirect` is true and slug changed:
   - Checks if redirect already exists
   - Updates existing or creates new redirect
   - Logs the action
3. Updates category
4. Returns success

#### Category Slug API (`/api/categories/slug/[slug]`)
**Process:**
1. Tries to find category with given slug
2. If not found, checks for redirect
3. If redirect exists, returns redirect info:
   ```json
   {
     "success": true,
     "redirect": true,
     "newSlug": "leather-bags"
   }
   ```
4. If no redirect, returns 404

### Frontend Changes

#### CategoryModal Component
**New State:**
- `originalSlug`: Stores the slug when editing starts
- `showRedirectOption`: Shows/hides redirect checkbox
- `createRedirect`: Whether to create redirect (default: true)

**Behavior:**
- When slug changes during edit, shows redirect option
- Checkbox is pre-checked (recommended)
- Admin can uncheck if they don't want redirect
- Sends redirect info to API on save

#### Category Page Component
**Redirect Handling:**
```typescript
if (categoryData.redirect && categoryData.newSlug) {
  window.location.href = `/categories/${categoryData.newSlug}`;
  return;
}
```

## Use Cases

### Case 1: Rebranding
```
Old: /categories/mens-accessories
New: /categories/professional-gear
✓ Create redirect (checked)
Result: Old links work, SEO preserved
```

### Case 2: Typo Fix
```
Old: /categories/lether-bags
New: /categories/leather-bags
✓ Create redirect (checked)
Result: Typo URL redirects automatically
```

### Case 3: URL Optimization
```
Old: /categories/bags-and-wallets-collection
New: /categories/bags-wallets
✓ Create redirect (checked)
Result: Shorter URL, old URL still works
```

### Case 4: Complete Category Change
```
Old: /categories/winter-collection
New: /categories/leather-jackets
☐ Create redirect (unchecked)
Result: Admin decides old URL shouldn't work
```

## Benefits

1. **SEO Preservation**
   - Old URLs retain their search engine ranking
   - No loss of link equity
   - Smooth transition for indexed pages

2. **User Experience**
   - No broken links
   - Bookmarks continue to work
   - Shared links remain valid

3. **Flexibility**
   - Admin has full control
   - Can choose redirect or not
   - Can update redirects anytime

4. **Link Management**
   - Centralized redirect system
   - Easy to track URL changes
   - Can be extended to products

## Admin Features

### Redirect Database
All redirects are stored and can be:
- ✅ Activated/deactivated
- ✅ Updated to new destination
- ✅ Chained (redirect → redirect → final)
- ✅ Tracked for analytics (future)

### Best Practices

**DO:**
- ✓ Create redirects when changing established URLs
- ✓ Use for rebranding or reorganization
- ✓ Keep redirects active for at least 1 year

**DON'T:**
- ✗ Create unnecessary redirects for new categories
- ✗ Chain too many redirects (max 2-3)
- ✗ Disable redirects without checking usage

## Future Enhancements

Possible additions:
- [ ] Redirect management dashboard
- [ ] Bulk redirect creation
- [ ] Redirect analytics (hit count)
- [ ] Automatic redirect cleanup
- [ ] Product slug redirects
- [ ] Custom redirect rules
- [ ] 301/302 redirect types
- [ ] Export redirect list

## Testing

### Test Scenario 1: Create Redirect
1. Edit category "Bags" → change slug to "leather-bags"
2. Keep redirect checkbox checked
3. Save
4. Visit `/categories/bags`
5. Should redirect to `/categories/leather-bags` ✓

### Test Scenario 2: No Redirect
1. Edit category "Test" → change slug to "test-2"
2. Uncheck redirect checkbox
3. Save
4. Visit `/categories/test`
5. Should show 404 ✓

### Test Scenario 3: Update Redirect
1. Category has redirect: old-bags → bags
2. Change slug from "bags" to "new-bags"
3. Keep redirect checked
4. Visit `/categories/old-bags`
5. Should redirect to `/categories/new-bags` ✓

## Database Queries

### Find all redirects
```javascript
await Redirect.find({ type: "category", isActive: true });
```

### Find redirect for slug
```javascript
await Redirect.findOne({ 
  fromSlug: "old-slug", 
  type: "category",
  isActive: true 
});
```

### Update redirect
```javascript
await Redirect.findByIdAndUpdate(id, {
  toSlug: "new-slug",
  isActive: true
});
```

## Notes

- Redirects are permanent (stored in database)
- Can be disabled without deletion
- Type field allows extending to products/other entities
- Compound index on (fromSlug, type) for fast lookups
- Redirect creation doesn't fail category update
- Console logs for debugging redirect creation

