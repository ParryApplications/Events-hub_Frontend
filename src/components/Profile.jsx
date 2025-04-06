import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import EventCard from "./EventCard";
import { getMyPostedEventsByUserId, logout } from "../apis/restApis";
import profileImg from "../assets/neutral-profile-img.png";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  ERROR,
  getSortedEventsByAlphabets,
  getSortedEventsByEventDateNewToOld,
  getSortedEventsByEventDateOldToNew,
  onRsvpButtonClick,
  showToast,
  SUCCESS,
} from "../utility/CommonUtility";
import { MdFilterList } from "react-icons/md";
import SortByContextMenu from "./SortByContextMenu";

export default function Profile() {
  const [sortByContextMenu, setSortByContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const { userDetails, isAuthenticated, setUserDetails, setIsAuthenticated } =
    useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [isProfileTabActive, setProfileTabActive] = useState(true);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const profileButtonRef = useRef(null);
  const myEventsButtonRef = useRef(null);

  // const isNoteDone = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    // if (isNoteDone && isNoteDone?.current === false) {
    // showToast(
    //   "Currently users are not allowed to modify their profile.",
    //   ERROR
    // );
    //   isNoteDone.current = true;
    // }

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
          <ProfileContent
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setIsAuthenticated={setIsAuthenticated}
            navigate={navigate}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        ) : (
          <PostedEventsContent
            myEvents={myEvents}
            setMyEvents={setMyEvents}
            isAuthenticated={isAuthenticated}
            userDetails={userDetails}
            sortByContextMenu={sortByContextMenu}
            setSortByContextMenu={setSortByContextMenu}
          />
        )}
      </div>
    </>
  );
}

const ProfileContent = ({
  userDetails,
  setUserDetails,
  setIsAuthenticated,
  navigate,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  return (
    <div className="rounded-4 mx-2 card p-3 d-flex flex-column gap-1 align-items-center">
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onConfirm={() => {
          setIsAuthenticated(false);
          // console.log("User Details before logout : ", userDetails);
          setUserDetails({});
          const isLogoutSuccess = logout(); //Remove Authorization headers
          navigate("/");

          if (isLogoutSuccess)
            showToast("Logged out successfully. Have a great day!", SUCCESS);
          else showToast("Failed to log out. Please try again later.", ERROR);

          setIsDialogOpen(false);
        }}
        message={"Are you sure you want to logout?"}
      />

      <img
        className="img-fluid custom-responsive-normal-img"
        src={profileImg}
        alt="Default Profile Image"
        width={200}
      />

      <h4 className="my-1">Welcome {userDetails.fullName}</h4>

      <div className="d-flex flex-column gap-3 mt-4">
        <div>
          <label htmlFor="emailFieldId">Email</label>
          <input
            id="emailFieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="email"
            value={userDetails.email || ""}
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
              value={userDetails.username || ""}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bioFiieldId">About</label>
          <textarea
            id="bioFiieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="bio"
            value={userDetails.bio || ""}
          />
        </div>

        <div>
          <label htmlFor="roleFieldId">Role</label>
          <input
            id="roleFieldId"
            disabled={true}
            className="form-control shadow-sm"
            name="role"
            value={userDetails.role || ""}
          />
        </div>

        <button
          type="submit"
          className="mt-5 btn btn-primary border border-2 shadow-sm cursor-pointer"
          // disabled={formik.isSubmitting}
          disabled={true}
        >
          Modify
        </button>

        <button
          type="submit"
          className="btn btn-danger border border-2 shadow-sm"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const PostedEventsContent = ({
  myEvents,
  setMyEvents,
  isAuthenticated,
  userDetails,
  setSortByContextMenu,
  sortByContextMenu,
}) => {
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
            setMyEvents(getSortedEventsByAlphabets(myEvents));
            handleSortByContextMenuClose();
          }}
          onSortingEventDateAscFilter={() => {
            setMyEvents(getSortedEventsByEventDateNewToOld(myEvents));
            handleSortByContextMenuClose();
          }}
          onSortingEventDateDscFilter={() => {
            setMyEvents(getSortedEventsByEventDateOldToNew(myEvents));
            handleSortByContextMenuClose();
          }}
        />
      )}

      <div className="container p-0 mb-2 mt-4 d-flex justify-content-end">
        {myEvents?.length > 0 && (
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
        {/* {myEvents && (
            <MdFilterList
              size={24}
              className="cursor-pointer"
              onClick={(e) => {
                setSortByContextMenu({
                  visible: true,
                  x: e.pageX,
                  y: e.pageY,
                });
              }}
            />
          )} */}
      </div>

      {myEvents &&
        myEvents.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            deleteEventFromList={deleteEventFromList}
            rsvpBellHandler={rsvpBellHandler}
            customRef={(el) => {
              if (event.verified === true) {
                el?.classList.add("verified-event");
              } else {
                el?.classList.remove("verified-event");
              }
            }}
          />
        ))}
    </>
  );
};
