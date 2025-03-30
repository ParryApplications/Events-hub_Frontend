import { useRef, useState } from "react";
import EventCard from "./EventCard";
import SubscribedEventCard from "./SubscribedEventCard";
import PastEventCard from "./PastEventCard";
import { useEffect } from "react";
import { getAllEvents, getAllEventsWithRsvpStatus } from "../apis/restApis";
import { useAuth } from "./AuthContext";
import {
  appQuotes,
  ERROR,
  getSortedEventsByAlphabets,
  getSortedEventsByEventDateNewToOld,
  getSortedEventsByEventDateOldToNew,
  isPastEvent,
  onRsvpButtonClick,
  showToast,
  SUCCESS,
} from "../utility/CommonUtility";
import { useNavigate } from "react-router-dom";
import { useScrollContext } from "./ScrollContext";
import Accordion from "./Accordion";
import Typed from "typed.js";
import { MdFilterList } from "react-icons/md";
import SortByContextMenu from "./SortByContextMenu";

export default function Home() {
  const { userDetails, isAuthenticated } = useAuth();
  const [eventList, setEventList] = useState([]);
  const [pastEventsList, setPastEventsList] = useState([]);
  const [hasSubscribedEvent, setHasSubscribedEvent] = useState(false);
  const [hasPastEvent, setHasPastEvent] = useState(false);
  const [sortByContextMenu, setSortByContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const postEventFieldRef = useRef(null);
  // const isGreetDone = useRef(false);

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
      const futureEventsFiltered = allEvents.filter(
        (e) => !isPastEvent(e.eventDate)
      );

      const sortedEvents =
        getSortedEventsByEventDateNewToOld(futureEventsFiltered);
      setEventList(sortedEvents);
      // console.log(eventList);

      const pastEventsFiltered = allEvents.filter((e) =>
        isPastEvent(e.eventDate)
      );

      setPastEventsList(pastEventsFiltered);
    } else {
      console.log("No events found.");
      showToast("No events found. Please come back later.", ERROR);
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
      const futureRsvpsEventsFiltered = allRsvpEvents.filter(
        (e) => !isPastEvent(e.eventDate)
      );
      const sortedRsvpEvents = getSortedEventsByEventDateNewToOld(
        futureRsvpsEventsFiltered
      );
      setEventList(sortedRsvpEvents);
      // console.log(eventList);

      const pastRsvpsEventsFiltered = allRsvpEvents.filter((e) =>
        isPastEvent(e.eventDate)
      );

      setPastEventsList(pastRsvpsEventsFiltered);
    } else {
      console.log("No events found.");
      showToast("No events found. Please come back later.", ERROR);
    }
  }

  useEffect(() => {
    //Quotes:
    const typedQuotes = new Typed("#typed-quotes-h2", {
      strings: appQuotes(),
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      showCursor: true,
      backDelay: 1500,
      shuffle: true,
      cursorChar: "|",
      // cursorChar: "_",
    });

    return () => {
      typedQuotes.destroy();
    };
  }, []);

  //Run only once on component Mount
  useEffect(() => {
    const checkIfUserAuthenticated = () => {
      if (isAuthenticated === true) {
        // console.log(isGreetDone);
        // if (!isGreetDone) {
        //   showToast(`Hi ${userDetails.fullName}, ${getGreeting()}`, SUCCESS);
        //   isGreetDone.current = true;
        // }

        loadAllEvents_ForLoggedInUsers();
      } else {
        // showToast("Kindly login or signup to enable all features.");
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
      showToast("Please log in to add or update events.", ERROR);
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
    } else {
      showToast("Invalid input, nothing to post.", ERROR);
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
      showToast("Kindly log in to subscribe the events.", ERROR);
      navigate("/login");
      return;
    }
  }

  /**
   * Method will be used to subscribe or unsubscribe an event (bell icon will adjust accordingly)
   * @param {*} event
   * @returns
   */
  async function rsvpBellHandler(event) {
    if (!isAuthenticated) {
      showToast("Kindly log in to subscribe to this event.", ERROR);
      navigate("/login");
      return;
    }

    const resultNum = await onRsvpButtonClick(
      userDetails.userId,
      event.eventId,
      event.eventDate
    );

    // console.log(resultNum, event?.status);

    if (resultNum === 1 && !event?.status) {
      showToast(
        `You've successfully subscribed to ${event.eventName} event.`,
        SUCCESS
      );
    } else if (resultNum === 1 && event?.status) {
      showToast(
        `You've successfully unsubscribed to ${event.eventName} event.`,
        SUCCESS
      );
    } else {
      showToast(
        `Something went wrong while subscribing to ${event.eventName} event.`,
        ERROR
      );
    }
    event.status = !event.status;
    updateEventList(event);
  }

  /**
   * Method will handle close the filter context menu if clicked outside of it
   */
  const handleSortByContextMenuClose = () => {
    setSortByContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      {sortByContextMenu?.visible && (
        <SortByContextMenu
          x={sortByContextMenu.x}
          y={sortByContextMenu.y}
          onClose={handleSortByContextMenuClose}
          onSortingAlphabetiallyFilter={() => {
            setEventList(getSortedEventsByAlphabets(eventList));
            handleSortByContextMenuClose();
          }}
          onSortingEventDateAscFilter={() => {
            setEventList(getSortedEventsByEventDateNewToOld(eventList));
            handleSortByContextMenuClose();
          }}
          onSortingEventDateDscFilter={() => {
            setEventList(getSortedEventsByEventDateOldToNew(eventList));
            handleSortByContextMenuClose();
          }}
        />
      )}

      <div className="fixed-height">
        <h3 id="typed-quotes-h2" className="d-inline p-1"></h3>
      </div>

      <div className="container my-3">
        <div className="d-flex gap-2 mx-2 mt-4">
          <input
            type="text"
            name="postEventField"
            ref={postEventFieldRef}
            placeholder="Spotted an event? Post Now!"
            // placeholder="Search events by name or venue, or post one."
            className="form-control fw-bold shadow-sm justify-content-start align-self-center text-for-short-space"
            onKeyDown={onKeyDownHandler}
          />

          <button
            className="btn btn-outline-success shadow-sm text-for-short-space justify-content-end align-self-center"
            onClick={onPostEventBtnHandler}
          >
            Post
          </button>
        </div>
        {/* <div className="d-flex justify-content-center gap-1 mt-2">
          <span class="badge rounded-pill bg-primary">Verified</span>
          <span class="badge rounded-pill bg-info badge-strike">Future</span>
          <span class="badge rounded-pill bg-success">Subscribed</span>
        </div> */}
      </div>

      <div className="p-0 mb-2 mt-4 d-flex justify-content-end">
        {eventList && (
          <button
            className="cursor-pointer btn btn-outline-primary btn-light custom-responsive-normal-text p-0 px-1 d-flex align-items-center justify-content-center gap-1"
            onClick={(e) => {
              setSortByContextMenu({
                visible: true,
                x: e.pageX,
                y: e.pageY,
              });
            }}
          >
            <MdFilterList />
            Sort By
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          {eventList.map((e) => (
            <EventCard
              key={e.eventId}
              event={e}
              deleteEventFromList={deleteEventFromList}
              customRef={(el) => {
                if (e.verified === true) {
                  el?.classList.add("verified-event");
                } else {
                  el?.classList.remove("verified-event");
                }
                eventRefs.current[e.eventId] = el;
              }}
              rsvpBellHandler={rsvpBellHandler}
              updateEvent={updateEventList}
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
                  isAuthenticated && hasSubscribedEvent ? "55vh" : "0vh",
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
                        rsvpBellHandler={rsvpBellHandler}
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
              style={{ maxHeight: hasPastEvent ? "55vh" : "0vh" }}
            >
              {pastEventsList
                // .filter((e) => isPastEvent(e.eventDate))
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
