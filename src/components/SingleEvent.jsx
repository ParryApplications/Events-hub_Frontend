import { useNavigate, useParams } from "react-router-dom";
import { ERROR, showToast, SUCCESS } from "../utility/CommonUtility";
import { getAnEvent } from "../apis/restApis";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useAuth } from "./AuthContext";

export default function SingleEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  // console.log(eventId);
  const [event, setEvent] = useState(null);
  const { isAuthenticated } = useAuth();

  /**
   * Method will remove an deleted event from the eventList based on the eventId.
   * This will re-render the Home.jsx component.
   * @param {*} deletedEventId
   */
  function deleteEventFromList(deletedEventId) {
    setEvent(null);
    navigate("/");
  }

  useEffect(() => {
    if (eventId) {
      getAnEvent(eventId)
        .then((res) => {
          if (!res.success) {
            showToast(res.message, ERROR);
            navigate("/");
          } else setEvent(res.data);
        })
        .catch((err) => {
          console.error("Error while fetching single event details: ", err);
          showToast(
            "Oops! The URL appears to be incorrect or no longer valid. Redirecting to the Home page.",
            ERROR
          );
          navigate("/");
        });
    }
  }, [eventId]);

  return (
    <div>
      {event !== null && (
        <EventCard
          key={eventId}
          event={event}
          deleteEventFromList={deleteEventFromList}
          customRef={(el) => {
            if (event.verified === true) {
              el?.classList.add("verified-event");
            } else {
              el?.classList.remove("verified-event");
            }
          }}
        />
      )}
    </div>
  );
}
