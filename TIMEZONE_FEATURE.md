# Timezone Management in Meeting Scheduler

## Overview

The meeting scheduler now automatically detects and displays the user's timezone, and creates calendar events that respect both the user's timezone and the organizer's Indian timezone (IST).

## Features

### 1. Automatic Timezone Detection

When the user opens the scheduler modal, the system automatically detects their timezone using the browser's `Intl.DateTimeFormat().resolvedOptions().timeZone` API.

**Examples:**
- User in New York → Detects `America/New_York` (EST/EDT)
- User in London → Detects `Europe/London` (GMT/BST)
- User in Dubai → Detects `Asia/Dubai` (GST)
- User in Sydney → Detects `Australia/Sydney` (AEDT/AEST)

### 2. Timezone Display in Scheduler

**Step 2 of the scheduler now shows:**
```
┌────────────────────────────────────────┐
│  🕐 Your Timezone: EST/EDT             │
│  America/New_York                      │
│  • All times shown in your local timezone │
└────────────────────────────────────────┘
```

**Supported Timezone Abbreviations:**
- `America/New_York` → EST/EDT
- `America/Chicago` → CST/CDT
- `America/Denver` → MST/MDT
- `America/Los_Angeles` → PST/PDT
- `Europe/London` → GMT/BST
- `Europe/Paris` → CET/CEST
- `Asia/Kolkata` → IST
- `Asia/Dubai` → GST
- `Australia/Sydney` → AEDT/AEST

### 3. Calendar Event Creation

When a meeting is scheduled, the Google Calendar event is created with:

**For the User:**
- Event time in their local timezone
- Calendar invitation shows time in their timezone
- They can join the meeting at the correct time in their location

**For the Organizer (Indian Team):**
- Same event automatically displayed in Indian Standard Time (IST)
- Google Calendar handles timezone conversion automatically
- No manual calculation needed

### 4. Event Description Shows Both Times

Calendar event description includes:
```
📅 Meeting Times:
• Client Time (America/New_York): Monday, January 15, 2025 at 2:00 PM
• India Time (IST): Monday, January 15, 2025 at 12:30 AM (next day)

📝 Notes:
[User's meeting notes]
```

## How It Works

### Frontend (Scheduler Modal)

1. **Timezone Detection:**
```typescript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Returns: "America/New_York", "Asia/Kolkata", etc.
```

2. **Timezone Storage:**
```typescript
formData.timezone = timezone; // Sent to backend with form data
```

3. **Display Format:**
```typescript
const timezoneMap = {
  "America/New_York": "EST/EDT",
  "Asia/Kolkata": "IST",
  // ... more mappings
};
```

### Backend (Google Calendar API)

1. **Receives timezone from form:**
```typescript
interface MeetingDetails {
  timezone?: string; // User's IANA timezone
}
```

2. **Creates event in user's timezone:**
```typescript
start: {
  dateTime: startDateTime,
  timeZone: userTimezone, // "America/New_York"
}
```

3. **Adds both times to description:**
```typescript
const userTimeStr = meetingDate.toLocaleString('en-US', { 
  timeZone: userTimezone 
});
const indianTimeStr = meetingDate.toLocaleString('en-US', { 
  timeZone: 'Asia/Kolkata' 
});
```

## Benefits

### ✅ For Users
- No timezone confusion
- See meeting times in their local time
- Calendar automatically adjusts for their timezone
- Clear indication of what timezone they're booking in

### ✅ For Organizers
- Automatically see meeting times in IST
- No manual timezone conversion needed
- Both times displayed in event description
- Google Calendar handles all conversions

### ✅ For International Business
- Supports customers worldwide
- Professional timezone handling
- Reduces missed meetings due to timezone errors
- Shows times in both client and organizer timezones

## Examples

### Scenario 1: US Customer (New York)

**Customer sees:**
- "Your Timezone: EST/EDT"
- Selects: "2:00 PM EST"

**What happens:**
- Customer's calendar: Jan 15, 2:00 PM EST
- Organizer's calendar: Jan 16, 12:30 AM IST (next day)
- Event description shows both times

### Scenario 2: UK Customer (London)

**Customer sees:**
- "Your Timezone: GMT/BST"
- Selects: "3:00 PM GMT"

**What happens:**
- Customer's calendar: Jan 15, 3:00 PM GMT
- Organizer's calendar: Jan 15, 8:30 PM IST (same day)
- Event description shows both times

### Scenario 3: Dubai Customer

**Customer sees:**
- "Your Timezone: GST"
- Selects: "10:00 AM GST"

**What happens:**
- Customer's calendar: Jan 15, 10:00 AM GST
- Organizer's calendar: Jan 15, 11:30 AM IST (same day)
- Event description shows both times

## Testing

### How to Test Different Timezones

1. **Change System Timezone:**
   - Windows: Settings → Time & Language → Date & Time
   - Mac: System Preferences → Date & Time → Time Zone
   - Linux: `timedatectl set-timezone America/New_York`

2. **Use Browser DevTools:**
   ```javascript
   // In Console, check detected timezone
   Intl.DateTimeFormat().resolvedOptions().timeZone
   ```

3. **Test Scenarios:**
   - Schedule a meeting
   - Check console logs for timezone detection
   - Verify timezone display in UI
   - Check calendar event times

## Technical Details

### IANA Timezone Database

Uses standard IANA timezone identifiers:
- Format: `Continent/City` (e.g., `America/New_York`)
- Handles DST automatically
- Supported globally by all modern browsers

### Google Calendar API

- Accepts timezone in ISO 8601 format with timezone
- Automatically converts between timezones
- Displays correctly in all users' calendars
- Handles DST transitions automatically

### Fallback Behavior

If timezone detection fails:
- Defaults to `Asia/Kolkata` (IST)
- Logs warning in console
- User can still schedule meetings
- Shows generic timezone label

## Future Enhancements

Potential improvements:
- [ ] Allow manual timezone selection
- [ ] Show organizer availability in user's timezone
- [ ] Display multiple timezone clocks side-by-side
- [ ] Suggest best meeting times based on business hours
- [ ] Add timezone conversion calculator
- [ ] Support for recurring meetings across timezones

## Troubleshooting

### Issue: Wrong timezone detected

**Solution:**
- Check system timezone settings
- Ensure browser has location permission (if using geolocation)
- Verify correct timezone in form data

### Issue: Calendar shows wrong time

**Solution:**
- Verify user's Google Calendar timezone settings
- Check that timezone is being sent to API
- Review server logs for timezone parameter

### Issue: Description times don't match

**Solution:**
- Ensure `toLocaleString` is using correct timezone parameter
- Verify IANA timezone format is valid
- Check Date object creation

## Summary

The timezone feature ensures that:
1. ✅ Users always see times in their local timezone
2. ✅ Organizers see times in Indian timezone (IST)
3. ✅ Calendar events are created correctly for both parties
4. ✅ No manual timezone conversion is needed
5. ✅ Both times are clearly displayed in event description

This provides a professional, error-free scheduling experience for international customers!

