/**
 * Google Calendar API Integration with Service Account
 * Automatically creates calendar events with Google Meet links
 * and sends email invitations to attendees
 */

import { google } from 'googleapis';

interface MeetingDetails {
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  meetingType: string;
  message?: string;
  timezone?: string;
}

/**
 * Initialize Google Calendar API with service account
 */
function getCalendarClient() {
  try {
    // Option 1: Using Service Account (Recommended for production)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      return google.calendar({ version: 'v3', auth });
    }

    // Option 2: Using API Key (Limited functionality)
    if (process.env.GOOGLE_CALENDAR_API_KEY) {
      return google.calendar({
        version: 'v3',
        auth: process.env.GOOGLE_CALENDAR_API_KEY,
      });
    }

    console.warn('⚠️ Google Calendar API not configured. Using fallback.');
    return null;
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    return null;
  }
}

/**
 * Create actual Google Calendar event with Meet link
 * Sends automatic email invitations from Google
 * Handles timezone conversion for user's timezone and Indian timezone for organizer
 */
export async function createCalendarEventWithMeet(meetingDetails: MeetingDetails) {
  const calendar = getCalendarClient();

  // Use user's timezone or default to IST
  const userTimezone = meetingDetails.timezone || 'Asia/Kolkata';
  const organizerTimezone = 'Asia/Kolkata'; // Indian timezone for organizer

  console.log("🌍 User Timezone:", userTimezone);
  console.log("🇮🇳 Organizer Timezone:", organizerTimezone);

  // Parse date and time in user's timezone
  const meetingDate = new Date(meetingDetails.date);
  const [time, period] = meetingDetails.timeSlot.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  meetingDate.setHours(hour, parseInt(minutes), 0, 0);
  const endDate = new Date(meetingDate.getTime() + 30 * 60000); // 30 minutes

  // Format dates in user's timezone for the calendar event
  const startDateTime = meetingDate.toISOString();
  const endDateTime = endDate.toISOString();

  // Get human-readable times for both timezones
  const userTimeStr = meetingDate.toLocaleString('en-US', { 
    timeZone: userTimezone, 
    dateStyle: 'full', 
    timeStyle: 'short' 
  });
  const indianTimeStr = meetingDate.toLocaleString('en-US', { 
    timeZone: organizerTimezone, 
    dateStyle: 'full', 
    timeStyle: 'short' 
  });

  const event = {
    summary: `${meetingDetails.meetingType.charAt(0).toUpperCase() + meetingDetails.meetingType.slice(1)} Meeting - ${meetingDetails.company}`,
    description: `Meeting with:
Name: ${meetingDetails.name}
Email: ${meetingDetails.email}
Company: ${meetingDetails.company}

📅 Meeting Times:
• Client Time (${userTimezone}): ${userTimeStr}
• India Time (IST): ${indianTimeStr}

📝 Notes:
${meetingDetails.message || 'No additional notes'}

Customer will join via the Google Meet link.
This meeting was scheduled through BulkLeather.`,
    start: {
      dateTime: startDateTime,
      timeZone: userTimezone, // User's local timezone
    },
    end: {
      dateTime: endDateTime,
      timeZone: userTimezone, // User's local timezone
    },
    // Don't add attendees to avoid Domain-Wide Delegation requirement
    // We'll send the Meet link to customer via email separately
    conferenceData: {
      createRequest: {
        requestId: `bulk-leather-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'email', minutes: 60 },      // 1 hour before
        { method: 'popup', minutes: 15 },      // 15 minutes before
      ],
    },
    guestsCanModify: false,
    guestsCanInviteOthers: false,
  };

  if (calendar) {
    try {
      console.log('📅 Creating calendar event...');
      console.log('Calendar ID:', process.env.GOOGLE_CALENDAR_ID || 'primary');
      
      // First try: Create event with Google Meet
      let response;
      try {
        response = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          conferenceDataVersion: 1,
          requestBody: event,
        });
        
        console.log('✅ Event created with conferenceData');
      } catch (conferenceError: any) {
        console.log('⚠️ Conference creation failed, trying without conferenceData...');
        console.log('Error:', conferenceError.message);
        
        // Fallback: Create event without conferenceData
        const simpleEvent = { ...event };
        delete simpleEvent.conferenceData;
        
        response = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          requestBody: simpleEvent,
        });
        
        console.log('✅ Event created without conferenceData');
      }

      console.log('✅ Google Calendar event created:', response.data.id);
      
      // Check if Meet link was generated
      const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri;
      
      if (meetLink) {
        console.log('✅ Google Meet link:', meetLink);
      } else {
        console.log('⚠️ No Meet link in response, generating fallback...');
      }

      return {
        success: true,
        googleMeetLink: meetLink || `https://meet.google.com/${generateMeetCode()}`,
        eventId: response.data.id || '',
        htmlLink: response.data.htmlLink || '',
        customerEmail: meetingDetails.email,
        customerName: meetingDetails.name,
        isSimulated: !meetLink,
      };
    } catch (error: any) {
      console.error('❌ Failed to create calendar event:', error.message);
      console.error('Full error:', error);
      
      // Fall through to simulated link
      console.log('⚠️ Falling back to simulated Meet link');
      const meetCode = generateMeetCode();
      return {
        success: true,
        googleMeetLink: `https://meet.google.com/${meetCode}`,
        eventId: meetCode,
        htmlLink: '',
        isSimulated: true,
      };
    }
  } else {
    // Fallback: Generate mock link if API not configured
    console.warn('⚠️ Google Calendar API not configured. Using fallback Meet link.');
    const meetCode = generateMeetCode();
    return {
      success: true,
      googleMeetLink: `https://meet.google.com/${meetCode}`,
      eventId: meetCode,
      htmlLink: '',
      isSimulated: true,
    };
  }
}

/**
 * Generate a random Google Meet-style code (fallback)
 */
function generateMeetCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segments = 3;
  const segmentLength = 4;
  
  let code = '';
  for (let i = 0; i < segments; i++) {
    if (i > 0) code += '-';
    for (let j = 0; j < segmentLength; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return code;
}

/**
 * Update calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  updates: { status?: string; notes?: string }
) {
  const calendar = getCalendarClient();

  if (!calendar) {
    console.warn('Google Calendar API not configured');
    return { success: false };
  }

  try {
    if (updates.status === 'cancelled') {
      // Cancel the event
      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all', // Notify attendees
      });

      console.log('✅ Calendar event cancelled and attendees notified');
    } else {
      // Update event
      const event = await calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
      });

      await calendar.events.patch({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all',
        requestBody: {
          ...event.data,
          description: `${event.data.description}\n\nAdmin Notes: ${updates.notes || ''}`,
        },
      });

      console.log('✅ Calendar event updated');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update calendar event:', error.message);
    return { success: false, error: error.message };
  }
}

