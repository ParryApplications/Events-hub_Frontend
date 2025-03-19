import eventPCardImage from "../assets/app-logo-icon.png";
import { convertDateIntoReadableFormat } from "../utility/CommonUtility";
import { useScrollContext } from "./ScrollContext";
import verifiedIcon from "../assets/verified-icon.svg";

export default function PastEventCard({ event }) {
  const { scrollToEvent } = useScrollContext();

  return (
    <div
      className="subs-event-card-div cursor-pointer bg-custom-strong"
      onClick={() => scrollToEvent(event.eventId)}
    >
      <img
        className="subs-event-card-img"
        src={event.imageUrl || eventPCardImage}
        alt="Past Event Card Image"
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
          <p className="d-inline custom-responsive-normal-text text-capitalize fw-bold fs-lg-5 m-0 mb-2">
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
      </div>
    </div>
  );
}
