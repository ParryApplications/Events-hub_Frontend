import eventPCardImage from "../assets/Event_icon.png";
import { useScrollContext } from "./ScrollContext";

export default function EventPPastCard({ event }) {
  const { scrollToEvent } = useScrollContext();

  return (
    <div
      className="event-p-past-card-div"
      onClick={() => scrollToEvent(event.eventId)}
    >
      <img
        className="event-image-img"
        src={event.imageUrl || eventPCardImage}
        alt="Past Event Image"
        onError={(e) => {
          e.target.onerror = null; // Prevents from infinite loops
          e.target.src = eventPCardImage; // Set default image
          console.log(`No image posted for eventId: ${event.eventId}`);
        }}
      />
      <div className="event-p-past-card-right-div">
        <h4 className="event-title-h">{event.eventName}</h4>
      </div>
    </div>
  );
}
