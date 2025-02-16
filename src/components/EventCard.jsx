import { useEffect, useState } from "react";
import { deleteEventByEventId, getUserDetailsByUserId } from "../apis/restApis";
import eventCardImage from "../assets/Event_card_icon.png";
import editEventIcon from "../assets/edit-event-icon.svg";
import bellOffIcon from "../assets/bell-off.svg";
import bellOnIcon from "../assets/bell-on.svg";
import { isPastEvent, onRsvpButtonClick } from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import ContextMenu from "./ContextMenu";

export default function EventCard({
  event,
  updateEvent,
  deleteEventFromList,
  customRef,
}) {
  const { userDetails, isAuthenticated } = useAuth();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();

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
    // console.log(
    //   "Delete button from ContextMenu clicked for eventId: " + event.eventId
    // );
    deleteEventByEventId(event.eventId);
    setContextMenu({ visible: false, x: 0, y: 0 });
    deleteEventFromList(event.eventId);
  };

  /**
   * Method will handle close event if clicked outside of the context menu
   */
  const handleContextMenuClose = () => {
    // console.log("Close Context Menu Click detected");
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      <div
        ref={customRef}
        className="event-card-div"
        onContextMenu={(e) =>
          userDetails.userId === event.postedByUserId && handleContextMenu(e)
        }
      >
        {isAuthenticated && userDetails.userId === event.postedByUserId && (
          <img
            src={editEventIcon}
            alt="edit-event"
            className="event-rsvp-button common-button-to-text"
            onClick={() => {
              navigate("/editEvent", { state: { event } });
            }}
          />
        )}
        <h3 className="event-title-h">{event.eventName}</h3>
        <p className="event-posted-details-p">
          Posted On {event.postedOn}, By {event.postedByFullName}
        </p>
        <div className="event-image-div">
          <img
            className="event-image-img"
            src={event.imageUrl || eventCardImage}
            alt="Event Image"
            onError={(e) => {
              e.target.onerror = null; //Prevents from infinite loops
              e.target.src = eventCardImage; // Set default image
              console.log(`No image posted for eventId: ${event.eventId}`);
            }}
          />
        </div>
        <h3 className="event-venue-details-h">
          (Venue: {event.venue} On {event.eventDate})
        </h3>
        <p className="event-description-p">{event.description}</p>
        {!isPastEvent(event.eventDate) && (
          <button
            className="event-rsvp-button common-button-to-text"
            onClick={() => {
              if (!isAuthenticated) {
                alert("Please log in to subscribe this event");
                navigate("/signup");
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
          >
            <img
              src={event?.status ? bellOffIcon : bellOnIcon}
              alt={event?.status ? "Bell Off" : "Bell On"}
            />
          </button>
        )}
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleContextMenuClose}
          onDelete={handleContextMenuDelete}
        />
      )}
    </>
  );
}
