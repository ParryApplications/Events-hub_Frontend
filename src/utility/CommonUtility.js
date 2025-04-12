import { Slide, toast } from "react-toastify";
import { toggleRsvpStatus } from "../apis/restApis";
import { FRONTEND_BASE_URL } from "../apis/CommonApiUtil";

//CONSTANTS:
export const ADMIN_ROLE = "ADMIN";
export const ERROR = "error";
export const SUCCESS = "success";
export const urlRegexExp = /(https?:\/\/[^\s]+)/g;

export function getSortedEventsByEventDateNewToOld(eventList) {
  return eventList.sort(
    (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
  );
}

export function getSortedEventsByEventDateOldToNew(eventList) {
  return eventList.sort(
    (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
  );
}

export function getSortedEventsByAlphabets(eventList) {
  return eventList.sort((a, b) => a.eventName.localeCompare(b.eventName));
}

export function isPastEvent(eventDate) {
  return new Date(eventDate) < new Date();
}

/**
 * Method will toggle the rsvp state, also calls the backend
 * @param event
 */
export async function onRsvpButtonClick(
  userId,
  eventId,
  eventDate,
  isVerified
) {
  const body = {
    userId: userId,
    eventId: eventId,
    eventDate: eventDate,
    verified: isVerified,
  };
  return await toggleRsvpStatus(body);
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
    "Explore Events Near You",
    "Big events, small reminders-stay in the loop!",
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

// For Toast:

/**
 * Method contains whole react toastify configuration
 * based on which it'll appear, also contains styling under index.css
 * @param {*} message
 * @param {*} type
 */
export const showToast = (message, type) => {
  toast(message, {
    position: "top-right",
    autoClose: 3000, // Auto-dismiss in 3s
    hideProgressBar: false, // Keep progress bar for visibility
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false, // Brevo-style has no close button
    transition: Slide,
    className: type === SUCCESS ? "toast-success" : "toast-error",
    bodyClassName: "toast-body",
    style: {
      background: "#333", // Brevo dark theme
      color: "#fff",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      fontSize: "14px",
      fontWeight: "500",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    icon: type === SUCCESS ? "✅" : "❌", // Emoji-based status icons
  });
};

/**
 * Method will use to open native share dialog as per the device user is using
 * @param {*} eventId
 */
export const handleShare = async (eventId) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this out!",
        text: "EventsHub have something interesting for you.",
        url: FRONTEND_BASE_URL + "/event/" + eventId, // Current page URL
      });
    } catch (error) {
      showToast(
        "Something went wrong while sharing. Please try again later.",
        ERROR
      );
      console.error("Error sharing:", error);
    }
  } else {
    showToast("This browser does not supports sharing.", ERROR);
  }
};
