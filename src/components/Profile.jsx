import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import EventCard from "./EventCard";
import { getMyPostedEventsByUserId } from "../apis/restApis";

export default function Profile() {
  const { userDetails } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [isProfileTabActive, setProfileTabActive] = useState(true);
  console.log(userDetails);

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
          document.getElementById("profile-button").classList.toggle("active");
          document
            .getElementById("my-events-button")
            .classList.toggle("active");
        }}
      >
        <div id="profile-button" className="active common-button-to-text">
          Profile
        </div>
        <div id="my-events-button" className="common-button-to-text">
          My Posted Events
        </div>
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
   * Method will update an event under the eventList state object
   * @param updatedEvent
   */
  function updateEventList(updatedEvent) {
    setMyEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
  }

  return (
    <>
      <h1>My Posted Events</h1>
      {myEvents &&
        myEvents.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            updateEvent={updateEventList}
          />
        ))}
    </>
  );
};
