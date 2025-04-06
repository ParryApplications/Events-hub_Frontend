import { RiShareForwardLine } from "react-icons/ri";
import eventPCardImage from "../assets/app-logo-icon.png";

import {
  convertDateIntoReadableFormat,
  handleShare,
  isPastEvent,
} from "../utility/CommonUtility";

import { useScrollContext } from "./ScrollContext";
import { BiBellOff } from "react-icons/bi";
import { useEffect, useRef } from "react";

export default function SubscribedEventCard({ event, rsvpBellHandler }) {
  const { scrollToEvent } = useScrollContext();
  const subsEventDivRef = useRef(null);

  useEffect(() => {
    if (subsEventDivRef?.current) {
      if (event.verified === true)
        subsEventDivRef.current?.classList.add("verified-subs-event");
      else subsEventDivRef.current?.classList.remove("verified-subs-event");
    }
  }, [event.verified]);

  return (
    <div
      ref={subsEventDivRef}
      className="subs-event-card-div cursor-pointer bg-custom-light"
      onClick={(e) => {
        scrollToEvent(event.eventId);
      }}
    >
      <img
        className="subs-event-card-img"
        src={event.imageUrl || eventPCardImage}
        alt="Subscribed Event Card Image"
        onError={(e) => {
          e.target.onerror = null; // Prevents from infinite loops
          e.target.src = eventPCardImage; // Set default image
          // console.log(
          //   `INFO: Setting Default image as No image posted for eventId: ${event.eventId}`
          // );
        }}
      />
      <div className="d-flex flex-column flex-fill justify-content-center">
        <div className="d-flex align-items-center">
          <p className="d-inline custom-responsive-normal-text text-capitalize fw-bold fs-lg-5 mb-2">
            {event.eventName}
          </p>
          {/* {event.verified === true && (
            <img
              src={verifiedIcon}
              className="event-card-edit-btn ms-1 custom-responsive-normal-icon mb-2"
              style={{ height: "1.5em", verticalAlign: "top" }}
              alt="Verified"
            />
          )} */}
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
          {!isPastEvent(event.eventDate) && (
            <BiBellOff
              className="responsive-icons"
              onClick={async (e) => {
                e.stopPropagation();
                await rsvpBellHandler(event);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
