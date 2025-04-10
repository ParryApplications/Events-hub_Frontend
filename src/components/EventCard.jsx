import { useRef, useState } from "react";
import {
  deleteEventByEventId,
  updateVerificationOfAnEvent_ADMIN,
} from "../apis/restApis";
import eventCardImage from "../assets/default-event-card-placeholder-img.png";
import {
  ADMIN_ROLE,
  convertDateIntoReadableFormat,
  ERROR,
  handleShare,
  isPastEvent,
  showToast,
  SUCCESS,
  urlRegexExp,
} from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import ContextMenu from "./ContextMenu";

import ConfirmationDialog from "./ConfirmationDialog";

import { MdLocationOn, MdMoreVert } from "react-icons/md";
import { BiBell, BiBellOff } from "react-icons/bi";
import { RiShareForwardLine, RiUserHeartFill } from "react-icons/ri";

export default function EventCard({
  event,
  deleteEventFromList,
  customRef,
  rsvpBellHandler,
  updateEvent,
}) {
  const { userDetails, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  let isEditIconClicked = useRef(false);
  const [showUserContri, setShowUserContri] = useState(false); //Works on hover only

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();

  const handleContextMenuEdit = () => {
    isEditIconClicked.current = true;
    setContextMenu({ visible: false, x: 0, y: 0 });
    setIsDialogOpen((prev) => !prev);
  };

  /**
   * Method will handle delete option click under context menu,
   * Based on the EventId, particular event will delete and contextMenu will closed
   */
  const handleContextMenuDelete = () => {
    isEditIconClicked.current = false;
    setContextMenu({ visible: false, x: 0, y: 0 });
    setIsDialogOpen((prev) => !prev);
    // console.log(
    //   "Delete button from ContextMenu clicked for eventId: " + event.eventId
    // );
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
      // console.log(updatedEvent);

      updateEvent(updatedEvent);
    }
  };

  const onEventMenuClick = (e) => {
    // console.log("Event Menu Click detected for eventId: " + event.eventId);
    setContextMenu({
      visible: true,
      x: e.pageX - 150,
      y: e.pageY,
    });
  };

  function findUrls(text) {
    return text.split(urlRegexExp).map((textPart, index) =>
      urlRegexExp.test(textPart) ? (
        <a
          key={index}
          href={textPart}
          target="_blank"
          rel="noopener noreferrer"
        >
          {textPart}
        </a>
      ) : (
        textPart
      )
    );
  }

  return (
    <div
      className="d-flex justify-content-center"
      onDoubleClick={onDoubleClickEventCardHandler}
    >
      {isDialogOpen && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onConfirm={() => {
            if (isEditIconClicked.current) {
              navigate("/editEvent", { state: { event } });
            } else {
              //Delete From Backend
              if (deleteEventByEventId(event.eventId)) {
                showToast(
                  `${event.eventName} event deleted successfully`,
                  SUCCESS
                );
              } else {
                showToast(
                  `Something went wrong while deleting ${event.eventName} event`,
                  ERROR
                );
              }
              deleteEventFromList(event.eventId); //UI List Update
            }
          }}
          onClose={() => {
            setIsDialogOpen((prev) => !prev);
          }}
          message={
            !isEditIconClicked.current
              ? `Confirm deletion? This will permanently remove ${event.eventName} event.`
              : "Proceed with editing? Ensure all details are correct before saving."
          }
        />
      )}

      <div
        ref={customRef}
        className="card rounded-4 mx-2 mb-4 shadow-sm custom-event-card-style card-striped"
      >
        <div className="card-body d-flex flex-column">
          {isAuthenticated &&
            ((userDetails.userId === event.postedByUserId &&
              !isPastEvent(event.eventDate)) ||
              userDetails.role === ADMIN_ROLE) && (
              <MdMoreVert
                size={24}
                className="align-self-end"
                onClick={onEventMenuClick}
              />
            )}

          <div className="text-center">
            <h3 className="card-title fw-bold text-capitalize d-inline m-0 mb-2">
              {event.eventName}
            </h3>
            {/* {event.verified === true && (
              <img
                src={verifiedIcon}
                className="event-card-edit-btn ms-1 custom-responsive-normal-icon mb-2"
                style={{ height: "2em", verticalAlign: "top" }}
                alt="Verified"
              />
            )} */}
          </div>

          <img
            className="mt-2 card-img-top image-fluid rounded align-self-center custom-event-img-style"
            src={event.imageUrl || eventCardImage}
            alt="Event Image"
            onError={(e) => {
              e.target.onerror = null; //Prevents from infinite loops
              e.target.src = eventCardImage; // Set default image
              // console.log(`No image posted for eventId: ${event.eventId}`);
            }}
          />

          <h5 className="text-center card-text my-2 custom-responsive-normal-text">
            <MdLocationOn />
            <a href={finalVenueUrl} target="_blank">
              Venue: {event.venue}
            </a>
            <br />
            (On {convertDateIntoReadableFormat(event.eventDate)})
          </h5>

          <p className="card-text custom-responsive-normal-text text-center">
            {findUrls(event.description)}
          </p>

          <div className="d-flex align-items-center justify-content-between">
            <div>
              <RiUserHeartFill
                size={20}
                onMouseEnter={() => {
                  setShowUserContri((prevStatus) => !prevStatus);
                }}
                onMouseLeave={() => {
                  setShowUserContri((prevStatus) => !prevStatus);
                }}
              />
            </div>

            <div className="d-flex gap-3">
              <RiShareForwardLine
                size={24}
                className="cursor-pointer"
                onClick={() => handleShare(event.eventId)}
              />
              {event?.status
                ? !isPastEvent(event.eventDate) && (
                    <BiBellOff
                      className="cursor-pointer"
                      size={24}
                      onClick={async () => await rsvpBellHandler(event)}
                    />
                  )
                : !isPastEvent(event.eventDate) && (
                    <BiBell
                      size={24}
                      className="cursor-pointer"
                      onClick={async () => await rsvpBellHandler(event)}
                    />
                  )}
            </div>
          </div>
        </div>
        {/* <div className="d-flex justify-content-center align-items-center vh-100"> */}
        <div className="position-relative">
          {showUserContri && (
            <div className="hover-message">
              {event?.verified === true ? (
                <>
                  {event.postedByFullName.length > 11
                    ? event.postedByFullName.split(" ")[0]
                    : event.postedByFullName}
                  , appreciate your authentic post!
                </>
              ) : (
                <>By {event.postedByFullName}, Not yet verified!</>
              )}
            </div>
          )}
        </div>

        {/* </div> */}
      </div>

      {isAuthenticated &&
        (userDetails.userId === event.postedByUserId ||
          userDetails.role === ADMIN_ROLE) &&
        contextMenu?.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onEdit={handleContextMenuEdit}
            onClose={handleContextMenuClose}
            onDelete={handleContextMenuDelete}
          />
        )}
    </div>
  );
}
