import { BACKEND_BASE_URL, eventsHubApiClient } from "./CommonApiUtil";

//constants:
const defaultIssueResponseObj = {
  success: false,
  mmessage: "Something went wrong. Please try again later",
  data: null,
};
const HTUA = "htua"; //Auth key for local storage (in reverse)

//API URL CONSTANTS:
const EVENT_BASE_URL = "/event/api";
const UPDATE_EVENT = EVENT_BASE_URL + "/{eventId}/user/{userId}";
const DELETE_EVENT_BY_EVENTID = EVENT_BASE_URL + "/{eventId}";
const POST_SAVE_USER = "/user/api";
const POST_USER_LOGIN = "/user/api/login";
const GET_ALL_EVENTS_WITH_RSVP = "/event/api/rsvp/user/{userId}";
const PUT_RSVP_BY_EVENTID_USERID = "/rsvp/api";
const GET_MY_POSTED_RSVP_EVENTS_BY_USERID =
  "/event/api/rsvp/user/{userId}/posted-events";
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
    // console.log(response, response.data);
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Save user details to the server
 * @param user
 * @returns saved user message
 */
export async function saveUser(user) {
  try {
    const savedUser = await eventsHubApiClient.post(POST_SAVE_USER, user);
    return savedUser.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
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
    localStorage.setItem(HTUA, JSON.stringify(response?.data?.data));
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Invalid credentials!",
      data: null,
    };
  }
  return defaultIssueResponseObj;
}

/**
 * Method will delete the Authorizatison header, to not use credentials further
 */
export async function logout() {
  try {
    localStorage.removeItem(HTUA);
    delete eventsHubApiClient.defaults.headers["Authorization"];
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
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Method will toggle the rsvp status for a particular event with userId and eventId
 * @param {*} event
 */
export async function toggleRsvpStatus(rsvp) {
  try {
    const response = await eventsHubApiClient.put(
      PUT_RSVP_BY_EVENTID_USERID,
      rsvp
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Method will return all evetns posted by particular given user
 * @param {*} userId
 * @returns
 */
export async function getMyPostedRsvpsEventsByUserId(userId) {
  try {
    const response = await eventsHubApiClient.get(
      GET_MY_POSTED_RSVP_EVENTS_BY_USERID.replace("{userId}", userId)
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Method will create new event and return it's details, if any issue, return false
 * @param {*} event
 * @returns
 */
export async function postNewEvent(event) {
  try {
    const response = await eventsHubApiClient.post(EVENT_BASE_URL, event);
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Method will update event and return it's details, if any issue, return false
 * @param {*} event
 * @returns
 */
export async function updateEvent(event, userId) {
  try {
    const response = await eventsHubApiClient.put(
      UPDATE_EVENT.replace("{eventId}", event.eventId).replace(
        "{userId}",
        userId
      ),
      event
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

/**
 * Method will delete event by EventId and return true or false, if any issue, return false
 * @param {*} eventId
 * @returns
 */
export async function deleteEventByEventId(eventId) {
  try {
    const response = await eventsHubApiClient.delete(
      DELETE_EVENT_BY_EVENTID.replace("{eventId}", eventId)
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
}

export async function updateVerificationOfAnEvent_ADMIN(userId, eventId) {
  try {
    const response = await eventsHubApiClient.patch(
      `${ADMIN_BASE_URL}eventVerification/user/${userId}/event/${eventId}`
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
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
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
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
    return response.data;
  } catch (err) {
    console.error(err.response.data.message);
    return err.response.data;
  }
  return defaultIssueResponseObj;
};
