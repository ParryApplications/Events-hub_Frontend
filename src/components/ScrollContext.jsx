import { createContext, useContext, useRef } from "react";

const ScrollContext = createContext();

export default function ScrollProvider({ children }) {
  const eventRefs = useRef([]);

  /**
   * Method will take eventId and based on that checks under eventRefs (Contains whole event List details), If exist then will scroll to that card
   * @param {string} eventId
   */
  const scrollToEvent = (eventId) => {
    if (eventRefs.current && eventRefs.current[eventId]) {
      eventRefs.current[eventId].scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <ScrollContext.Provider value={{ eventRefs, scrollToEvent }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollContext);
