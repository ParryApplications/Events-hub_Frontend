import { useState } from "react";
import {
  deleteEventByEventId,
  updateVerificationOfAnEvent_ADMIN,
} from "../apis/restApis";
import eventCardImage from "../assets/default-event-card-placeholder-img.png";
import editEventIcon from "../assets/edit-icon.svg";
import bellOffIcon from "../assets/rsvp-bell-icon-off.svg";
import bellOnIcon from "../assets/rsvp-bell-icon-on.svg";
import verifiedIcon from "../assets/verified-icon.svg";
import {
  convertDateIntoReadableFormat,
  isPastEvent,
  onRsvpButtonClick,
} from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import ContextMenu from "./ContextMenu";
import { useLongPress } from "use-long-press";
import ConfirmationDialog from "./ConfirmationDialog";

export default function EventCard({
  event,
  updateEvent,
  deleteEventFromList,
  customRef,
}) {
  const { userDetails, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  let isEditIconClicked = false;

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();

  const onLongPressCallback = (e) => {
    console.log("onLongPressCallback");
    console.log(e);
    handleContextMenu(e);
  };

  const longPressHandler = useLongPress(onLongPressCallback, {
    captureEvent: true, // Ensures event data is captured
  });

  /**
   * Method handled onContextMenu event (Right Click event)
   * @param {*} e
   * @param {*} eventId
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    // console.log("Right Click detected under event Id: " + eventId);
    // console.log("x: , y: ", e.pageX, e.pageY);
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
    });
  };

  /**
   * Method will handle delete option click under context menu,
   * Based on the EventId, particular event will delete and contextMenu will closed
   */
  const handleContextMenuDelete = () => {
    isEditIconClicked = false;
    setIsDialogOpen((prev) => !prev);
    // console.log(
    //   "Delete button from ContextMenu clicked for eventId: " + event.eventId
    // );
  };

  const EditEventHandler = () => {
    isEditIconClicked = true;
    setIsDialogOpen((prev) => !prev);
  };

  /**
   * Method will handle close event if clicked outside of the context menu
   */
  const handleContextMenuClose = () => {
    // console.log("Close Context Menu Click detected");
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  function buildMapUrl() {
    const BASE_MAP_QUERY_URL =
      "https://www.google.com/maps/search/?api=1&query=";

    try {
      const venueExpression = event.venue
        .split(",")
        .map((word) => word.trim().replace(/\s+/g, "+"))
        .join(",");

      // console.log(BASE_MAP_QUERY_URL + venueExpression);
      return BASE_MAP_QUERY_URL + venueExpression;
    } catch (e) {
      console.error("Error building map URL for event: ", event.eventId, e);
      return "https://www.google.com/maps";
    }
  }

  const finalVenueUrl = buildMapUrl();

  const onDoubleClickEventCardHandler = async () => {
    if (isAuthenticated && userDetails.role === "ADMIN") {
      alert("Going to toggle the verification of this event");
      const updatedEvent = await updateVerificationOfAnEvent_ADMIN(
        userDetails.userId,
        event.eventId
      );
      console.log(updatedEvent);

      updateEvent(updatedEvent);
    }
  };

  return (
    <div
      className="d-flex justify-content-center"
      onDoubleClick={() => {
        console.log("Double-click detected!");
        onDoubleClickEventCardHandler();
      }}
    >
      {isDialogOpen && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onConfirm={() => {
            if (isEditIconClicked) {
              navigate("/editEvent", { state: { event } });
            } else {
              deleteEventByEventId(event.eventId);
              setContextMenu({ visible: false, x: 0, y: 0 });
              deleteEventFromList(event.eventId);
            }
          }}
          onClose={() => {
            setIsDialogOpen((prev) => !prev);
          }}
        />
      )}

      <div
        {...longPressHandler()}
        ref={customRef}
        className="card rounded-4 mx-2 mb-4 shadow-sm custom-event-card-style"
        onContextMenu={(e) =>
          isAuthenticated &&
          userDetails.userId === event.postedByUserId &&
          handleContextMenu(e)
        }
      >
        <div className="card-body d-flex flex-column">
          {isAuthenticated && userDetails.userId === event.postedByUserId && (
            <img
              className="event-card-edit-btn align-self-end custom-responsive-normal-icon"
              src={editEventIcon}
              alt="edit-event"
              onClick={EditEventHandler}
            />
          )}

          <div className="text-center">
            <h3 className="card-title fw-bold text-capitalize d-inline m-0 mb-2">
              {event.eventName}
            </h3>
            {event.verified === true && (
              <img
                src={verifiedIcon}
                className="event-card-edit-btn ms-1 custom-responsive-normal-icon mb-2"
                style={{ height: "2em", verticalAlign: "top" }}
                alt="Verified"
              />
            )}
          </div>

          <img
            className="mt-2 card-img-top image-fluid rounded align-self-center custom-event-img-style"
            src={event.imageUrl || eventCardImage}
            alt="Event Image"
            onError={(e) => {
              e.target.onerror = null; //Prevents from infinite loops
              e.target.src = eventCardImage; // Set default image
              console.log(`No image posted for eventId: ${event.eventId}`);
            }}
          />

          <h5 className="text-center card-text my-2 custom-responsive-normal-text">
            <a href={finalVenueUrl} target="_blank">
              Venue: {event.venue}
            </a>
            <br />
            (On {convertDateIntoReadableFormat(event.eventDate)})
          </h5>

          <p className="card-text custom-responsive-normal-text text-center">
            {event.description}
          </p>

          {/* <p className="text-end custom-responsive-normal-text card-text">
            Posted On {convertDateIntoReadableFormat(event.postedOn)}, By{" "}
            {event.postedByFullName}
          </p> */}

          {!isPastEvent(event.eventDate) && (
            <img
              src={event?.status ? bellOffIcon : bellOnIcon}
              alt={event?.status ? "Bell Off" : "Bell On"}
              className="event-card-rsvp-btn align-self-end custom-responsive-normal-icon"
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please log in to subscribe this event");
                  navigate("/login");
                  return;
                }

                onRsvpButtonClick(
                  userDetails.userId,
                  event.eventId,
                  event.eventDate
                );

                event.status = !event.status;
                updateEvent(event);
              }}
            />
          )}
        </div>
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleContextMenuClose}
          onDelete={handleContextMenuDelete}
        />
      )}
    </div>
  );
}
