import { useEffect, useRef } from "react";
import EventBus from "../utility/EventBus.jsx";
export default function Accordion() {
  const faqDivRef = useRef(null);

  useEffect(() => {
    EventBus.emit("faqDivRef", faqDivRef);
  }, []);

  return (
    <div className="accordion mb-4" id="faq-accordion" ref={faqDivRef}>
      <h4 className="rounded-pill faq-accordion-style text-white p-1 text-center fs-4">
        FAQs
      </h4>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button fw-medium"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            What does this app do?
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            This app is your all-in-one platform for discovering, sharing, and
            managing upcoming events, and it&rsquo;s completely free to use.
            You&rsquo;ll also receive gentle email reminders for the events
            you&rsquo;ve subscribed to, so you never miss out on exciting
            opportunities around you.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTwo">
          <button
            className="accordion-button collapsed fw-medium"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            How do I subscribe to an event, and what can I expect afterward?
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            Please note that you can only subscribe to verified events. To
            subscribe, simply click the bell icon located at the bottom-right
            corner of the event card. Once subscribed, you&rsquo;ll receive a
            confirmation via a pop-up message. You'll then receive two gentle
            reminders: the first one a day before the event, and the second on
            the day of the event itself. Both reminders are sent around 8 AM
            IST.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingThree">
          <button
            className="accordion-button collapsed fw-medium"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="false"
            aria-controls="collapseThree"
          >
            What&rsquo;s the process, and how do I know if an event is verified?
          </button>
        </h2>
        <div
          id="collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            Once a user posts an event, our team will review the event details.
            Within 24 hours, the event will either be removed or marked as
            verified. Verified events will display a 'Verified' icon—a white
            checkmark on a blue background—at the top-left corner of the event
            card.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFour">
          <button
            className="accordion-button collapsed fw-medium"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFour"
            aria-expanded="false"
            aria-controls="collapseFour"
          >
            Is my personal information safe?
          </button>
        </h2>
        <div
          id="collapseFour"
          className="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            Yes, the app uses end-to-end encryption, ensuring that even we
            cannot access your password. You can confidently use the app,
            knowing your data is secure.
          </div>
        </div>
      </div>

      {/* <div className="accordion-item">
        <h2 className="accordion-header" id="headingFive">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFive"
            aria-expanded="false"
            aria-controls="collapseFive"
          >
            Is my personal information safe?
          </button>
        </h2>
        <div
          id="collapseFive"
          className="accordion-collapse collapse"
          aria-labelledby="headingFive"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            Yes, the app uses end-to-end encryption, ensuring that even we
            cannot access your password. You can confidently use the app,
            knowing your data is secure.
          </div>
        </div>
      </div> */}

      {/* <div className="accordion-item">
        <h2 className="accordion-header" id="headingSix">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseSix"
            aria-expanded="false"
            aria-controls="collapseSix"
          >
            What happens if an event is canceled?
          </button>
        </h2>
        <div
          id="collapseSix"
          className="accordion-collapse collapse"
          aria-labelledby="headingSix"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            If an event is canceled, the organizer will update the status, and
            you’ll receive a notification if you're subscribed.
          </div>
        </div>
      </div> */}
    </div>
  );
}
