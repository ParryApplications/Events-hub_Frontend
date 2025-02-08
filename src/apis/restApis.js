import { eventsHubApiClient } from "./CommonApiUtil";

//API URL CONSTANTS:
const GET_ALL_EVENTS = "/event/api"; //Calls with no login
const POST_SAVE_USER = "/user/api";
const POST_USER_LOGIN = "/user/api/login";
const GET_ALL_EVENTS_WITH_RSVP = "/event/api/rsvp/user/{userId}";
const PUT_RSVP_BY_EVENTID_USERID = "/rsvp/api";
const REMOVE_PAST_RSVPS_BY_USERID = "/rsvp/api/removePastEvents/{userId}";
const GET_MY_POSTED_EVENTS_BY_USERID = "/event/api/user/{userId}";

/**
 * Fetch all events from the server (without RSVP details)
 * Use this method before user Logged in
 * @returns Event Details
 */
export async function getAllEvents() {
  try {
    const response = await eventsHubApiClient.get(GET_ALL_EVENTS);
    // console.log(response.data);
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
    return `${savedUser.fullName} user saved successfully`;
  } catch (err) {
    console.error(`Error while saving user: ${err.message}`);
    return "Failed to save user";
  }
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
  } catch (err) {
    console.error(`Error while toggling RSVP status: ${err.message}`);
  }
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
