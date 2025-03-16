import { toggleRsvpStatus } from "../apis/restApis";

export function getSortedEventsByEventDate(eventList) {
  return eventList.sort(
    (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
  );
}

export function isPastEvent(eventDate) {
  return new Date(eventDate) < new Date();
}

/**
 * Method will toggle the rsvp state, also calls the backend
 * @param event
 */
export function onRsvpButtonClick(userId, eventId, eventDate) {
  console.log("RSVP button clicked");
  const body = {
    userId: userId,
    eventId: eventId,
    eventDate: eventDate,
  };
  toggleRsvpStatus(body);
}

/**
 * Method will return a readable date time format
 * @param {*} date
 * @returns ReadableDateTime Format
 */
export function convertDateIntoReadableFormat(date) {
  return new Date(date).toLocaleString();
}

/**
 * Method returns list of catchy & Attractive quotes for EventsHub Users
 * @returns Array of quotes
 */
export function appQuotes() {
  return [
    "Big events, small reminders—stay in the loop!",
    "See it, share it, celebrate it! What's happening next?",
    "Big or small, every event deserves the spotlight!",
    "Events are better when shared. Post yours now!",
    "One app, endless events. Never miss out again!",
    "Great moments should never be missed!",
    "Your gateway to unforgettable moments. Let's get started!",
    "Stay ahead of the crowd—your next event awaits!",
    "Never miss a moment. Find, follow, and enjoy every event!",
  ];
}
