import eventPCardImage from "../assets/Event_icon.png";
import bellOffIcon from "../assets/bell-off.svg";
import bellOnIcon from "../assets/bell-on.svg";
import { onRsvpButtonClick } from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";
import { useScrollContext } from "./ScrollContext";

export default function EventPartialCard({ event, updateEvent }) {
  const { userDetails, isAuthenticated } = useAuth();
  const { scrollToEvent } = useScrollContext();

  return (
    <div
      className="event-pcard-div"
      onClick={() => scrollToEvent(event.eventId)}
    >
      <img
        className="event-image-img"
        src={event.imageUrl || eventPCardImage}
        alt="Interested Event Image"
        onError={(e) => {
          e.target.onerror = null; // Prevents from infinite loops
          e.target.src = eventPCardImage; // Set default image
          console.log(`No image posted for eventId: ${event.eventId}`);
        }}
      />
      <div className="event-pcard-right-div">
        <h4 className="event-title-h">{event.eventName}</h4>
        <p className="event-description-p">{event.eventDate}</p>
        {isAuthenticated && (
          <button
            className="event-rsvp-button common-button-to-text"
            onClick={() => {
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
    </div>
  );
}
