import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import EventCard from "./EventCard";
import { getMyPostedEventsByUserId } from "../apis/restApis";

export default function Profile() {
  const { userDetails } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [isProfileTabActive, setProfileTabActive] = useState(true);
  //   console.log(userDetails);

  const profileButtonRef = useRef(null);
  const myEventsButtonRef = useRef(null);

  useEffect(() => {
    const loadMyEvents = async () => {
      const eventsList = await getMyPostedEventsByUserId(userDetails?.userId);
      if (eventsList) {
        setMyEvents(eventsList);
      }
    };
    loadMyEvents();
  }, [userDetails]);

  return (
    <div className="profile-main-div">
      <div
        className="toggle-profile-events-div"
        onClick={() => {
          setProfileTabActive((prevState) => !prevState);
          if (profileButtonRef.current && myEventsButtonRef.current) {
            profileButtonRef.current.classList.toggle(
              "active",
              isProfileTabActive
            );
            myEventsButtonRef.current.classList.toggle(
              "active",
              !isProfileTabActive
            );
          }
        }}
      >
        <button ref={profileButtonRef} className="active common-button-to-text">
          Profile
        </button>
        <button ref={myEventsButtonRef} className="common-button-to-text">
          My Posted Events
        </button>
      </div>
      <br />

      <div className="content-div">
        {isProfileTabActive ? (
          <ProfileContent userDetails={userDetails} />
        ) : (
          <PostedEventsContent myEvents={myEvents} setMyEvents={setMyEvents} />
        )}
      </div>
      <hr />
    </div>
  );
}

const ProfileContent = ({ userDetails }) => {
  return (
    <>
      <h1>Profile</h1>
      <p>Welcome {userDetails.fullName},</p>
      <p>Email: {userDetails.email}</p>
      <p>Bio: {userDetails.bio}</p>
      <p>
        Member since: {new Date(userDetails.createdAt).toLocaleDateString()}
      </p>
      <p>ROLE: {userDetails.role}</p>
    </>
  );
};

const PostedEventsContent = ({ myEvents, setMyEvents }) => {
  /**
   * Method will remove an deleted event from the eventList based on the eventId.
   * This will re-render the Home.jsx component.
   * @param {*} deletedEventId
   */
  function deleteEventFromList(deletedEventId) {
    setMyEvents((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== deletedEventId)
    );
  }

  /**
   * Method will update an event under the eventList state object
   * @param updatedEvent
   */
  const updateEventList = useCallback((updatedEvent) => {
    console.log("Updating eventList function called!");
    setMyEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
  }, []);

  return (
    <>
      <h1>My Posted Events</h1>
      {myEvents &&
        myEvents.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            updateEvent={updateEventList}
            deleteEventFromList={deleteEventFromList}
          />
        ))}
    </>
  );
};
