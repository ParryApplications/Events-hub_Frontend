import { BACKEND_BASE_URL, eventsHubApiClient } from "./CommonApiUtil";

//API URL CONSTANTS:
const EVENT_BASE_URL = "/event/api";
const UPDATE_EVENT = EVENT_BASE_URL + "/{eventId}";
const DELETE_EVENT_BY_EVENTID = EVENT_BASE_URL + "/{eventId}";
const POST_SAVE_USER = "/user/api";
const POST_USER_LOGIN = "/user/api/login";
const GET_ALL_EVENTS_WITH_RSVP = "/event/api/rsvp/user/{userId}";
const PUT_RSVP_BY_EVENTID_USERID = "/rsvp/api";
const REMOVE_PAST_RSVPS_BY_USERID = "/rsvp/api/removePastEvents/{userId}";
const GET_MY_POSTED_EVENTS_BY_USERID = "/event/api/user/{userId}";
const GET_USER_DETAILS_BY_USERID = "/user/api/{userId}";
const ADMIN_BASE_URL = "/admin/api/";
const SECURITY_BASE_URL = "/security/api";

/**
 * Fetch all events from the server (without RSVP details)
 * Use this method before user Logged in
 * @returns Event Details
 */
export async function getAllEvents() {
  try {
    const response = await eventsHubApiClient.get(EVENT_BASE_URL);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(`Error while fetching all events: ${err.message}`);
  }
}

/**
 * Save user details to the server
 * @param user
 * @returns saved user message
 */
export async function saveUser(user) {
  try {
    const savedUser = await eventsHubApiClient.post(POST_SAVE_USER, user);
    // console.log(savedUser.data);
    if (savedUser && savedUser.data) {
      return true;
    }
  } catch (err) {
    console.error(`Error while saving user: ${err.message}`);
  }
  return false;
}
/**
 * If User is valid, Method will return the user details fetched by username
 * otherwise it will return null
 * @param username
 * @returns userDetails | null
 */
export async function login(user) {
  try {
    const credentials = "Basic " + btoa(`${user.username}:${user.password}`);
    eventsHubApiClient.defaults.headers["Authorization"] = credentials;
    const response = await eventsHubApiClient.post(POST_USER_LOGIN, user);
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(`Error while validating user: ${err.message}`);
    return false;
  }
}

/**
 * Method will delete the Authorizatison header, to not use credentials further
 */
export async function logout() {
  try {
    delete eventsHubApiClient.defaults.headers["Authorization"];
    console.log("Logged out successfully");
    return true;
  } catch (err) {
    console.error(`Error while logging out: ${err.message}`);
  }
  return false;
}

/**
 * Method will return the whole list of events with RSVP status for a particular user
 * Use this method after user Logged in successfully
 * @param {*} userId
 * @returns list of events with RSVP status
 */
export async function getAllEventsWithRsvpStatus(userId) {
  try {
    const response = await eventsHubApiClient.get(
      GET_ALL_EVENTS_WITH_RSVP.replace("{userId}", userId)
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(
      `Error while fetching whole list of events with RSVP status: ${err.message}`
    );
  }
}

/**
 * Method will toggle the rsvp status for a particular event with userId and eventId
 * @param {*} event
 */
export async function toggleRsvpStatus(rsvp) {
  try {
    await eventsHubApiClient.put(PUT_RSVP_BY_EVENTID_USERID, rsvp);
    return 1;
  } catch (err) {
    console.error(`Error while toggling RSVP status: ${err.message}`);
  }
  return -1;
}

/**
 * Method will delete all past RSVPs for a particular user and eventId
 * @param {*} userId
 * @returns
 */
export async function deletePastRsvpsByUserId(userId) {
  try {
    const response = await eventsHubApiClient.delete(
      REMOVE_PAST_RSVPS_BY_USERID.replace("{userId}", userId)
    );
    console.log("Past RSVPs deleted successfully");
    return response;
  } catch (err) {
    console.error(`Error while deleting past RSVPs by userId: ${err.message}`);
    return false;
  }
}

/**
 * Method will return all evetns posted by particular given user
 * @param {*} userId
 * @returns
 */
export async function getMyPostedEventsByUserId(userId) {
  try {
    const response = await eventsHubApiClient.get(
      GET_MY_POSTED_EVENTS_BY_USERID.replace("{userId}", userId)
    );
    console.log("My posted events fetched successfully");
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(
      `Error while fetching my posted events by userId: ${err.message}`
    );
    return undefined;
  }
}

/**
 * Method will return userDetails by UserId
 * @param {*} userId
 * @returns
 */
export async function getUserDetailsByUserId(userId) {
  try {
    const response = await eventsHubApiClient.get(
      GET_USER_DETAILS_BY_USERID.replace("{userId}", userId)
    );
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(
      `Error while fetching user details by userId: ${err.message}`
    );
    return undefined;
  }
}

/**
 * Method will create new event and return it's details, if any issue, return false
 * @param {*} event
 * @returns
 */
export async function postNewEvent(event) {
  try {
    const response = await eventsHubApiClient.post(EVENT_BASE_URL, event);
    console.log("New event posted successfully");
    return response.data;
  } catch (err) {
    console.error(`Error while posting new event: ${err.message}`);
    return false;
  }
}

/**
 * Method will update event and return it's details, if any issue, return false
 * @param {*} event
 * @returns
 */
export async function updateEvent(event) {
  try {
    const response = await eventsHubApiClient.put(
      UPDATE_EVENT.replace("{eventId}", event.eventId),
      event
    );
    console.log("Event updated successfully");
    return response.data;
  } catch (err) {
    console.error(`Error while updating event: ${err.message}`);
    return false;
  }
}

/**
 * Method will delete event by EventId and return true or false, if any issue, return false
 * @param {*} eventId
 * @returns
 */
export async function deleteEventByEventId(eventId) {
  try {
    await eventsHubApiClient.delete(
      DELETE_EVENT_BY_EVENTID.replace("{eventId}", eventId)
    );
    console.log("Event deleted successfully");
    return true;
  } catch (err) {
    console.error(`Error while deleting event by eventId: ${err.message}`);
    return false;
  }
}

export async function updateVerificationOfAnEvent_ADMIN(userId, eventId) {
  try {
    console.log(userId, eventId);

    if (!userId || !eventId) {
      throw new Error("userId or eventId is missing");
    }

    console.log(userId, eventId);

    const response = await eventsHubApiClient.patch(
      `${ADMIN_BASE_URL}eventVerification/user/${userId}/event/${eventId}`
    );
    if (response?.data) {
      console.log(response.data);
      console.log("Event verification updated successfully");
      return response.data;
    }
  } catch (err) {
    console.error(`Error while updating event verification: ${err.message}`);
  }
  return undefined;
}

/**
 * Fetch an event from the server (without RSVP details)
 * Using this method as logged in user is not persisted
 * @returns Signle Event Details
 */
export async function getAnEvent(eventId) {
  try {
    const response = await eventsHubApiClient.get(
      `${EVENT_BASE_URL}/${eventId}`
    );
    console.log(response.data);
    return response?.data;
  } catch (err) {
    console.error(`Error while fetching eventId-${eventId} : ${err.message}`);
  }
  return null;
}

export const verifyEmailApi = async (token, userId) => {
  try {
    const response = await eventsHubApiClient.post(
      `${SECURITY_BASE_URL}/verify/email`,
      {
        verificationToken: token,
        userId: userId,
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(`Error while verifying email: ${err.message}`);
    return undefined;
  }
};
