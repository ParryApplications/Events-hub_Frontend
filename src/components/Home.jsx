import { useState } from "react";
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

export default function Home() {
  const { userDetails, isAuthenticated } = useAuth();
  const [eventList, setEventList] = useState([]);

  async function loadAllEvents_ForNonLoggedInUser() {
    const allEvents = await getAllEvents();

    if (allEvents && Object.keys(allEvents).length > 0) {
      const sortedEvents = getSortedEventsByEventDate(allEvents);
      setEventList(sortedEvents);
    } else {
      console.log("No events found.");
    }
  }

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

  return (
    <div className="home-div">
      <div className="events-cards-div">
        {eventList.map((e) => (
          <EventCard key={e.eventId} event={e} updateEvent={updateEventList} />
        ))}
      </div>

      <div className="right-home-div">
        <div className="interested-upcoming-events-div">
          <h3 className="interested-upcoming-events-div-h">
            Intrested Upcoming Events
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
