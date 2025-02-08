import { useEffect } from "react";
import { getUserDetailsByUserId } from "../apis/restApis";
import eventCardImage from "../assets/Event_card_icon.png";
import bellOffIcon from "../assets/bell-off.svg";
import bellOnIcon from "../assets/bell-on.svg";
import { isPastEvent, onRsvpButtonClick } from "../utility/CommonUtility";
import { useAuth } from "./AuthContext";

export default function EventCard({ event, updateEvent }) {
  const { userDetails, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEventsPostedByUserDetails = async () => {
      const eventUserDetails = await getUserDetailsByUserId(
        event.postedByUserId
      );
      if (eventUserDetails) {
        const { fullName } = eventUserDetails;
        event.postedByFullName = fullName;
      }
    };

    fetchEventsPostedByUserDetails();
  }, []);

  return (
    <div className="event-card-div">
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
      {isAuthenticated && !isPastEvent(event.eventDate) && (
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
  );
}
