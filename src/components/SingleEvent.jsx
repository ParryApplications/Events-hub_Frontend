import { useNavigate, useParams } from "react-router-dom";
import {
  ERROR,
  getGreeting,
  showToast,
  SUCCESS,
} from "../utility/CommonUtility";
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

  useEffect(() => {
    if (eventId) {
      getAnEvent(eventId)
        .then((res) => {
          // console.log(res);
          if (res == null || res == "") {
            showToast(
              "Oops! The URL appears to be incorrect or no longer valid. Redirecting to the Home page.",
              ERROR
            );
            navigate("/");
          } else setEvent(res);
        })
        .catch((err) => {
          console.error("Error while fetching event details: ", err);
          showToast(
            "Oops! The URL appears to be incorrect or no longer valid. Redirecting to the Home page.",
            ERROR
          );
          navigate("/");
        });
    }

    if (!isAuthenticated) {
      setTimeout(() => {
        showToast(`Hi, ${getGreeting()}`, SUCCESS);
      }, 1500);
    }
  }, [eventId]);

  return (
    <div>
      {event !== null && (
        <EventCard
          key={eventId}
          event={event}
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
