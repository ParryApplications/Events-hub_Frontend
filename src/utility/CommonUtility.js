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
