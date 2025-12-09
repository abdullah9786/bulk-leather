/**
 * Google Calendar API Integration
 * Creates calendar events with Google Meet links
 */

interface MeetingDetails {
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  meetingType: string;
  message?: string;
}

/**
 * Generate a Google Meet link and calendar event
 * Note: This is a simplified version that generates a meet link
 * For production, integrate with Google Calendar API properly
 */
export async function createGoogleMeetEvent(meetingDetails: MeetingDetails) {
  try {
    // Parse date and time
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
    const endDate = new Date(meetingDate.getTime() + 30 * 60000); // 30 minutes later

    // Generate a unique Google Meet link (simplified)
    // In production, use Google Calendar API to create actual events
    const meetCode = generateMeetCode();
    const googleMeetLink = `https://meet.google.com/${meetCode}`;

    // For production implementation:
    // 1. Use Google Calendar API with service account
    // 2. Create calendar event with conferenceData
    // 3. Get actual Meet link from response
    // 4. Send calendar invites to both admin and user

    const calendarEvent = {
      summary: `${meetingDetails.meetingType.charAt(0).toUpperCase() + meetingDetails.meetingType.slice(1)} Meeting - ${meetingDetails.company}`,
      description: `Meeting with ${meetingDetails.name} from ${meetingDetails.company}\n\n${meetingDetails.message || 'No additional notes'}\n\nJoin via Google Meet: ${googleMeetLink}`,
      start: {
        dateTime: meetingDate.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: meetingDetails.email },
        { email: 'inquiry@houseoflamode.com.com' }, // Admin email
      ],
      conferenceData: {
        createRequest: {
          requestId: meetCode,
        }
      }
    };

    return {
      googleMeetLink,
      eventId: meetCode, // In production, this would be the actual calendar event ID
      calendarEvent,
    };
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    throw error;
  }
}

/**
 * Generate a random Google Meet-style code
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
 * Get Google Calendar add event URL
 */
export function getGoogleCalendarUrl(meetingDetails: MeetingDetails, meetLink: string): string {
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
  const endDate = new Date(meetingDate.getTime() + 30 * 60000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${meetingDetails.meetingType.charAt(0).toUpperCase() + meetingDetails.meetingType.slice(1)} Meeting - ${meetingDetails.company}`,
    dates: `${formatDate(meetingDate)}/${formatDate(endDate)}`,
    details: `Meeting with BulkLeather\n\nGoogle Meet Link: ${meetLink}\n\n${meetingDetails.message || ''}`,
    location: meetLink,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

