export default function Accordion() {
  return (
    <div className="accordion mb-4" id="faq-accordion">
      <h4 className="rounded-pill faq-accordion-style text-white p-1 text-center fs-4">
        FAQs
      </h4>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            What is this app about?
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            This app is your one-stop hub for discovering, posting, and tracking
            upcoming events. Never miss out on exciting happenings around you!
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTwo">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            How can I find upcoming events?
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">...</div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingThree">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="false"
            aria-controls="collapseThree"
          >
            How & When do I get notified about events?
          </button>
        </h2>
        <div
          id="collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            When you subscribe to an event, we’ll send you a reminder one day
            before the event starts.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFour">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFour"
            aria-expanded="false"
            aria-controls="collapseFour"
          >
            Do I need an account to use the app?
          </button>
        </h2>
        <div
          id="collapseFour"
          className="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            You can browse events without an account, but to post, subscribe, or
            get notifications, you'll need to sign up.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFive">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFive"
            aria-expanded="false"
            aria-controls="collapseFive"
          >
            Is the app free to use?
          </button>
        </h2>
        <div
          id="collapseFive"
          className="accordion-collapse collapse"
          aria-labelledby="headingFive"
          data-bs-parent="#faq-accordion"
        >
          <div className="accordion-body">
            Yes! The app is completely free to browse and post events.
          </div>
        </div>
      </div>

      <div className="accordion-item">
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
      </div>
    </div>
  );
}
