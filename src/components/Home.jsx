import { useRef, useState } from "react";
import EventCard from "./EventCard";
import EventPartialCard from "./EventPartialCard";
import EventPPastCard from "./EventPPastCard";
import { useEffect } from "react";
import { getAllEvents, getAllEventsWithRsvpStatus } from "../apis/restApis";
import { useAuth } from "./AuthContext";
import {
  getSortedEventsByEventDate,
  isPastEvent,
} from "../utility/CommonUtility";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { userDetails, isAuthenticated } = useAuth();
  const [eventList, setEventList] = useState([]);

  const postEventFieldRef = useRef(null);

  const navigate = useNavigate();

  /**
   * Method will return the list of events posted by all so far,
   * This will fetch details as per the Non-Logged in user
   * List will be Sorted by Event Date
   */
  async function loadAllEvents_ForNonLoggedInUser() {
    const allEvents = await getAllEvents();

    if (allEvents && Object.keys(allEvents).length > 0) {
      const sortedEvents = getSortedEventsByEventDate(allEvents);
      setEventList(sortedEvents);
    } else {
      console.log("No events found.");
    }
  }

  /**
   * Method will return the list of events posted by all so far,
   * This will fetch details as per the Logged in user
   * List will be Sorted by Event Date
   */
  async function loadAllEvents_ForLoggedInUsers() {
    const allRsvpEvents = await getAllEventsWithRsvpStatus(userDetails?.userId);

    if (allRsvpEvents && Object.keys(allRsvpEvents).length > 0) {
      const sortedRsvpEvents = getSortedEventsByEventDate(allRsvpEvents);
      setEventList(sortedRsvpEvents);
    } else {
      console.log("No events found.");
    }
  }

  //Run only once on component Mount
  useEffect(() => {
    const checkIfUserAuthenticated = () => {
      if (isAuthenticated === true) {
        console.log("Authenticated User Detected");
        loadAllEvents_ForLoggedInUsers();
      } else {
        console.log("Non-Authenticated User Detected");
        loadAllEvents_ForNonLoggedInUser();
      }
    };
    checkIfUserAuthenticated();
  }, [isAuthenticated]);

  /**
   * Method will update an event under the eventList state object
   * @param updatedEvent
   */
  function updateEventList(updatedEvent) {
    setEventList((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
  }

  /**
   * Method will remove an deleted event from the eventList based on the eventId.
   * This will re-render the Home.jsx component.
   * @param {*} deletedEventId
   */
  function deleteEventFromList(deletedEventId) {
    setEventList((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== deletedEventId)
    );
  }

  /**
   * Method contains logic which hits once post event button if clicked
   * Logic: sends the event Title into event form component, and ask other necessary event details
   */
  function onPostEventBtnHandler() {
    if (
      postEventFieldRef.current &&
      postEventFieldRef.current.value.trim() != ""
    ) {
      const event = {
        eventName: postEventFieldRef.current.value,
      };
      // postEventFieldRef.current.value = "";
      navigate("/addEvent", { state: { event } });
    }
  }

  /**
   * Method will invoke if user fill something under the post event field and hit "Enter"
   * @param {*} event
   */
  function onKeyDownHandler(event) {
    if (event.key === "Enter") {
      onPostEventBtnHandler();
    }
  }

  return (
    <div className="home-div">
      <div className="events-cards-div">
        {eventList.map((e) => (
          <EventCard
            key={e.eventId}
            event={e}
            updateEvent={updateEventList}
            deleteEventFromList={deleteEventFromList}
          />
        ))}
      </div>

      <div className="right-home-div">
        <div className="post-event-div">
          <input
            type="text"
            name="postEventField"
            ref={postEventFieldRef}
            placeholder="Know any upcoming event?"
            className="post-event-field-input"
            onKeyDown={onKeyDownHandler}
          />
          <button
            className="post-event-submit-button"
            onClick={onPostEventBtnHandler}
          >
            Post
          </button>
        </div>

        <div className="interested-upcoming-events-div">
          <h3 className="interested-upcoming-events-div-h">
            Subscribed Upcoming Events
          </h3>
          {isAuthenticated &&
            eventList
              .filter((e) => e?.status && !isPastEvent(e.eventDate))
              .map((e) => (
                <EventPartialCard
                  key={e.eventId}
                  event={e}
                  updateEvent={updateEventList}
                />
              ))}
        </div>

        <div className="past-events-div interested-upcoming-events-div">
          <h3 className="past-events-div-h interested-upcoming-events-div-h">
            Past Events
          </h3>
          {eventList
            .filter((e) => isPastEvent(e.eventDate))
            .map((e) => (
              <EventPPastCard key={e.eventId} event={e} />
            ))}
        </div>
      </div>
    </div>
  );
}
