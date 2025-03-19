import eventPCardImage from "../assets/app-logo-icon.png";
import bellOffIcon from "../assets/rsvp-bell-icon-off.svg";
import bellOnIcon from "../assets/rsvp-bell-icon-on.svg";
import verifiedIcon from "../assets/verified-icon.svg";
import {
  convertDateIntoReadableFormat,
  onRsvpButtonClick,
} from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";
import { useScrollContext } from "./ScrollContext";

export default function SubscribedEventCard({ event, updateEvent }) {
  const { userDetails, isAuthenticated } = useAuth();
  const { scrollToEvent } = useScrollContext();

  return (
    <div
      className="subs-event-card-div cursor-pointer bg-custom-light"
      onClick={() => scrollToEvent(event.eventId)}
    >
      <img
        className="subs-event-card-img"
        src={event.imageUrl || eventPCardImage}
        alt="Subscribed Event Card Image"
        onError={(e) => {
          e.target.onerror = null; // Prevents from infinite loops
          e.target.src = eventPCardImage; // Set default image
          console.log(
            `INFO: Setting Default image as No image posted for eventId: ${event.eventId}`
          );
        }}
      />
      <div className="d-flex flex-column flex-fill justify-content-center">
        <div className="d-flex align-items-center">
          <p className="d-inline custom-responsive-normal-text text-capitalize fw-bold fs-lg-5 mb-2">
            {event.eventName}
          </p>
          {event.verified === true && (
            <img
              src={verifiedIcon}
              className="event-card-edit-btn ms-1 custom-responsive-normal-icon mb-2"
              style={{ height: "1.5em", verticalAlign: "top" }}
              alt="Verified"
            />
          )}
        </div>
        <p className="card-text custom-responsive-normal-text mb-2">
          Date of Event: {convertDateIntoReadableFormat(event.eventDate)}
        </p>
        {isAuthenticated && (
          <img
            className="subs-event-card-rsvp-btn align-self-end custom-responsive-normal-icon"
            src={event?.status ? bellOffIcon : bellOnIcon}
            alt={event?.status ? "Bell Off" : "Bell On"}
            onClick={() => {
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
  );
}
