import { useRef, useState } from "react";
import EventCard from "./EventCard";
import SubscribedEventCard from "./SubscribedEventCard";
import PastEventCard from "./PastEventCard";
import { useEffect } from "react";
import { getAllEvents, getAllEventsWithRsvpStatus } from "../apis/restApis";
import { useAuth } from "./AuthContext";
import {
  appQuotes,
  getSortedEventsByEventDate,
  isPastEvent,
} from "../utility/CommonUtility";
import { useNavigate } from "react-router-dom";
import { useScrollContext } from "./ScrollContext";
import Accordion from "./Accordion";
import Typed from "typed.js";

export default function Home() {
  const { userDetails, isAuthenticated } = useAuth();
  const [eventList, setEventList] = useState([]);
  const [hasSubscribedEvent, setHasSubscribedEvent] = useState(false);
  const [hasPastEvent, setHasPastEvent] = useState(false);

  const postEventFieldRef = useRef(null);
  const quotesH2Ref = useRef(null);

  const { eventRefs } = useScrollContext();

  const navigate = useNavigate();

  // let subsEventsCount = 0,
  //   pastEventsCount = 0;

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

  useEffect(() => {
    //Quotes:
    const typedQuotes = new Typed(quotesH2Ref.current, {
      strings: appQuotes(),
      typeSpeed: 70,
      backSpeed: 25,
      loop: true,
      showCursor: true,
    });

    return () => {
      typedQuotes.destroy();
    };
  }, []);

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
    if (!isAuthenticated) {
      alert("Please first log in to add or update events.");
      navigate("/login");
      return;
    }

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

  function onSubscribedHeadingClickHandler() {
    if (!isAuthenticated) {
      alert("Please first log in to Subscribe events.");
      navigate("/signup");
      return;
    }
  }

  return (
    <>
      <h2 id="typed-quotes-h2" className="d-inline p-1" ref={quotesH2Ref}></h2>

      <div className="container">
        <div className="d-flex gap-2 mx-2 my-4">
          <input
            type="text"
            name="postEventField"
            ref={postEventFieldRef}
            placeholder="Spotted an event? Post Now!"
            className="form-control fw-bold shadow-sm justify-content-start align-self-center custom-responsive-normal-text"
            onKeyDown={onKeyDownHandler}
          />
          <button
            className="btn btn-outline-success shadow-sm custom-responsive-normal-text justify-content-end align-self-center"
            onClick={onPostEventBtnHandler}
          >
            Post
          </button>
        </div>
      </div>

      <div className="row justify-content-between">
        <div className="col-12 col-lg-8">
          {eventList.map((e) => (
            <EventCard
              key={e.eventId}
              event={e}
              updateEvent={updateEventList}
              deleteEventFromList={deleteEventFromList}
              customRef={(el) => (eventRefs.current[e.eventId] = el)}
            />
          ))}
          <hr id="accordion-hr-start" />
          <Accordion />
        </div>

        <div className="col-12 col-lg-4">
          <div className="card mb-3 p-1 bg-app-theme">
            <h3
              className="rounded-pill bg-primary bg-gradient text-white p-1 text-center fs-4 cursor-pointer"
              onClick={onSubscribedHeadingClickHandler}
            >
              Subscribed Events
              {/* <span class="badge rounded-circle px-2 py-1 bg-custom-badge-strong align-self-end custom-responsive-normal-text">
                {subsEventsCount}
              </span> */}
            </h3>
            <div
              className="overflow-auto d-flex flex-column"
              style={{
                maxHeight:
                  isAuthenticated && hasSubscribedEvent ? "50vh" : "0vh",
              }}
            >
              {isAuthenticated &&
                eventList
                  .filter((e) => e?.status && !isPastEvent(e.eventDate))
                  .map((e) => {
                    if (!hasSubscribedEvent) setHasSubscribedEvent(true);

                    // subsEventsCount += 1;
                    return (
                      <SubscribedEventCard
                        key={e.eventId}
                        event={e}
                        updateEvent={updateEventList}
                      />
                    );
                  })}
            </div>
          </div>

          <hr />

          <div className="card my-3 p-1 bg-app-theme">
            <h3 className="border border-2 rounded-pill bg-custom-strong bg-gradient text-white p-1 text-center fs-4 fw-bold">
              Past Events
            </h3>
            <div
              className="overflow-auto d-flex flex-column"
              style={{ maxHeight: hasPastEvent ? "50vh" : "0vh" }}
            >
              {eventList
                .filter((e) => isPastEvent(e.eventDate))
                .map((e) => {
                  if (!hasPastEvent) setHasPastEvent(true);

                  return <PastEventCard key={e.eventId} event={e} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
