import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import EventCard from "./EventCard";
import { getMyPostedEventsByUserId } from "../apis/restApis";
import profileImg from "../assets/neutral-profile-img.png";
import { Navigate, useNavigate } from "react-router-dom";

export default function Profile() {
  const { userDetails, isAuthenticated } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [isProfileTabActive, setProfileTabActive] = useState(true);
  const navigate = useNavigate();
  //   console.log(userDetails);

  const profileButtonRef = useRef(null);
  const myEventsButtonRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    const loadMyEvents = async () => {
      const eventsList = await getMyPostedEventsByUserId(userDetails?.userId);
      if (eventsList) {
        setMyEvents(eventsList);
      }
    };
    loadMyEvents();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="d-flex w-50">
          <button
            ref={profileButtonRef}
            className="btn btn-primary round-left p-2 flex-grow-1"
            onClick={() => {
              setProfileTabActive(true);
              if (profileButtonRef.current && myEventsButtonRef.current) {
                profileButtonRef.current.classList.add("btn-primary");
                profileButtonRef.current.classList.remove(
                  "btn-outline-primary"
                );
                myEventsButtonRef.current.classList.remove("btn-primary");
                myEventsButtonRef.current.classList.add("btn-outline-primary");
              }
            }}
          >
            Profile
          </button>
          <button
            ref={myEventsButtonRef}
            className="btn btn-outline-primary round-right p-2 flex-grow-1"
            onClick={() => {
              setProfileTabActive(false);
              if (profileButtonRef.current && myEventsButtonRef.current) {
                profileButtonRef.current.classList.remove("btn-primary");
                profileButtonRef.current.classList.add("btn-outline-primary");
                myEventsButtonRef.current.classList.add("btn-primary");
                myEventsButtonRef.current.classList.remove(
                  "btn-outline-primary"
                );
              }
            }}
          >
            Events
          </button>
        </div>
      </div>

      <hr className="container" />

      <div className="my-2">
        {isProfileTabActive ? (
          <ProfileContent userDetails={userDetails} />
        ) : (
          <PostedEventsContent myEvents={myEvents} setMyEvents={setMyEvents} />
        )}
      </div>
    </>
  );
}

const ProfileContent = ({ userDetails }) => {
  return (
    <div className="rounded-4 mx-2 card p-3 d-flex flex-column gap-1 align-items-center">
      <img
        className="img-fluid custom-responsive-normal-img"
        src={profileImg}
        alt="Default Profile Image"
        width={200}
      />

      <h4 className="my-1">Welcome {userDetails.fullName},</h4>

      <div className="d-flex flex-column gap-3 mt-4">
        <div>
          <label htmlFor="emailFieldId">Email</label>
          <input
            id="emailFieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="email"
            value={userDetails.email}
          />
        </div>

        <div>
          <label htmlFor="usernameFieldId">Username</label>
          <div className="input-group">
            <span className="input-group-text shadow-sm">@</span>
            <input
              id="usernameFieldId"
              type="text"
              disabled={true}
              className="form-control shadow-sm"
              name="username"
              value={userDetails.username}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bioFiieldId">About</label>
          <input
            id="bioFiieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="bio"
            value={userDetails.bio}
          />
        </div>

        <div>
          <label htmlFor="roleFieldId">Role</label>
          <input
            id="roleFieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="role"
            value={userDetails.role}
          />
        </div>

        <button
          type="submit"
          className="mt-5 btn btn-primary border border-2  shadow-lg"
          // disabled={formik.isSubmitting}
          disabled={true}
        >
          Modify
        </button>
      </div>
    </div>
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
