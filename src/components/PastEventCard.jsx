import { useNavigate } from "react-router-dom";
import eventPCardImage from "../assets/app-logo-icon.png";
import {
  convertDateIntoReadableFormat,
  handleShare,
} from "../utility/CommonUtility";

import { useEffect, useRef } from "react";
import { RiShareForwardLine } from "react-icons/ri";

export default function PastEventCard({ event }) {
  // const { scrollToEvent } = useScrollContext();
  const pastEventDivRef = useRef(null);
  const navigate = useNavigate();

  function onClickHandler() {
    navigate(`/event/${event.eventId}`);
  }

  useEffect(() => {
    if (pastEventDivRef?.current) {
      if (event.verified === true)
        pastEventDivRef.current?.classList.add("verified-subs-event");
      else pastEventDivRef.current?.classList.remove("verified-subs-event");
    }
  }, [event.verified]);

  return (
    <div
      ref={pastEventDivRef}
      className="subs-event-card-div cursor-pointer bg-custom-strong"
      onClick={onClickHandler}
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
        </div>
        <p className="card-text custom-responsive-normal-text mb-2">
          DOE: {convertDateIntoReadableFormat(event.eventDate)}
        </p>
        <div className="align-self-end d-flex align-items-center justify-content-center gap-3">
          <RiShareForwardLine
            className="responsive-icons"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(event.eventId);
            }}
          />
        </div>
      </div>
    </div>
  );
}
