# Timezone Storage & Display Feature

## Overview
The meeting scheduler now captures and stores the user's timezone in the database and displays it in the admin dashboard for better timezone management.

## Implementation Details

### 1. Database Schema
**File:** `models/Meeting.ts`

Added timezone field to the Meeting interface and schema:
```typescript
interface IMeeting {
  // ... other fields
  timezone?: string; // User's IANA timezone (e.g., America/New_York)
}

// Schema field
timezone: {
  type: String,
  default: "Asia/Kolkata", // Default to IST if not provided
}
```

### 2. API Validation
**File:** `app/api/meetings/route.ts`

Updated Zod schema to accept timezone:
```typescript
const meetingSchema = z.object({
  // ... other fields
  timezone: z.string().optional(), // User's IANA timezone
});
```

### 3. Frontend Detection
**File:** `components/scheduler/SchedulerModal.tsx`

Timezone is automatically detected using browser API:
```typescript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
```

The timezone is:
- Detected when the modal opens
- Displayed to the user in the UI
- Included in the form submission
- Passed to Google Calendar API for accurate event creation

### 4. Admin Dashboard Display
**File:** `app/admin/meetings/page.tsx`

Timezone is displayed in two places:

#### Meeting List Table
Shows a shortened timezone display (e.g., "New York" instead of "America/New_York"):
```typescript
{meeting.timezone && (
  <p className="text-xs text-blue-600 mt-0.5">
    🌍 {meeting.timezone.split('/')[1]?.replace('_', ' ') || meeting.timezone}
  </p>
)}
```

#### Meeting Detail Modal
Shows the full IANA timezone identifier:
```typescript
{selectedMeeting.timezone && (
  <p className="text-xs text-blue-600 mt-1">
    🌍 {selectedMeeting.timezone}
  </p>
)}
```

## Timezone Format
- **Storage:** IANA timezone format (e.g., `America/New_York`, `Europe/London`, `Asia/Kolkata`)
- **Display:** User-friendly format with 🌍 emoji indicator
- **Default:** `Asia/Kolkata` (IST) if timezone is not provided

## Benefits
1. **Better Scheduling:** Organizers can see the user's local timezone for each meeting
2. **Accurate Calendar Events:** Google Calendar events are created in the user's timezone
3. **Clear Communication:** Event descriptions include both user's time and organizer's time (IST)
4. **Historical Data:** All meetings store timezone for future reference

## Console Logs
When a meeting is created, the API logs:
```
✅ Meeting created: [meeting_id]
🌍 Timezone: America/New_York
```

## Related Files
- `models/Meeting.ts` - Database schema
- `app/api/meetings/route.ts` - API validation and storage
- `components/scheduler/SchedulerModal.tsx` - Frontend detection
- `app/admin/meetings/page.tsx` - Admin display
- `lib/google-calendar-api.ts` - Calendar integration

## Testing
1. Schedule a meeting from different timezones
2. Check the admin dashboard to verify timezone is displayed
3. Verify Google Calendar event shows correct times
4. Check MongoDB to confirm timezone is stored correctly

## Future Enhancements
- Add timezone conversion tools in admin dashboard
- Display meeting time in both user and admin timezones
- Add timezone filtering in admin dashboard
- Show timezone abbreviations (EST, PST, etc.) alongside IANA names

