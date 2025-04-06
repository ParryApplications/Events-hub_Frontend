import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postNewEvent, updateEvent } from "../apis/restApis";
import { useAuth } from "./AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSuggestedAddress } from "../apis/thirdPartyRestApis";
import { debounce } from "lodash";
import { ERROR, showToast, SUCCESS } from "../utility/CommonUtility";

export default function AddEditEventForm() {
  const isUpdateOperation = useLocation().pathname.includes("editEvent");
  const navigate = useNavigate();
  const [isAck, setIsAck] = useState(false);
  const { userDetails, isAuthenticated } = useAuth();
  const [isImgTooltipOpen, setisImgTooltipOpen] = useState(false);
  const selectedVenueDetails = useRef(null);
  let uniqueIncrementNum = 2004;
  const abortControllerRef = useRef(null);

  //For AutoComplete Address:
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    const handleClickOutside = () => {
      //Delay clearing suggestions to allow 'onClick' to execute first
      setTimeout(() => setSuggestions([]), 300);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if editing an existing event
  const event = useLocation().state?.event;
  let title;

  if (isUpdateOperation) {
    // console.log("Editing event:", event);
    // console.log(event);
    title = "Update Event";
  } else {
    // console.log("Creating new event");
    // console.log(event);
    title = "Post New Event";
  }

  const validationSchema = Yup.object({
    eventName: Yup.string().required("Event Name is Required"),
    venue: Yup.string().required("Venue is Required"),
    eventDate: Yup.date()
      .min(new Date(), "Only Future Events are Permitted")
      .required("Event Date-Time is Required"),
    imageUrl: Yup.string().url("Invalid URL"),
    description: Yup.string(),
  });

  /**
   * Remove Unnecessary fields from the venue map details object
   * @param {*} venueMapDetails
   */
  function buildVenueMapDetailsContent(venueMapDetails) {
    const result = {
      lat: venueMapDetails?.lat,
      lng: venueMapDetails?.lng,
      properties: {
        name: venueMapDetails?.properties?.name,
        city: venueMapDetails?.properties?.city,
        state: venueMapDetails?.properties?.state,
        postcode: venueMapDetails?.properties?.postcode,
        street: venueMapDetails?.properties?.street,
        country: venueMapDetails?.properties?.country,
        osm_id: venueMapDetails?.properties?.osm_id,
      },
    };
    return result;
  }

  /**
   * Method handling the add/update event button event
   * @param {*} values
   */
  const handleFormSubmit = async (values) => {
    setSuggestions([]);
    if (!isAck || isImgTooltipOpen) {
      return;
    }

    // console.log(selectedVenueDetails);
    // console.log(
    //   buildVenueNameFromDetails(selectedVenueDetails?.current?.properties)
    // );
    // console.log(values.venue);

    //Check is user selected venue from our suggested list:
    if (
      selectedVenueDetails.current &&
      buildVenueNameFromDetails(selectedVenueDetails.current.properties) ===
        values.venue
    ) {
      // console.log("Yes, User selected venue from our suggested list");
      values.venueMapDetails = buildVenueMapDetailsContent(
        selectedVenueDetails.current
      );
    }

    // console.log("Form submitted with values: ", values);

    if (!isAuthenticated) {
      alert("Please first log in to add or update events.");
      navigate("/login");
      return;
    }

    if (isUpdateOperation) {
      const reqBody = {
        ...event,
        ...values,
      };
      // console.log(reqBody);
      const response = await updateEvent(reqBody);
      if (!response) {
        showToast("Event update failed. Please try again later.", ERROR);
      } else {
        showToast(
          `${reqBody?.eventName} event has been updated successfully.`,
          SUCCESS
        );
        formik.resetForm();
        navigate("/");
      }
    } else {
      values.postedByUserId = userDetails.userId;
      values.postedByFullName = userDetails.fullName;
      const response = await postNewEvent(values);
      // console.log(!response);
      if (!response) {
        showToast("Failed to add event. Please try again later.", ERROR);
      } else {
        // console.log("Else block running");
        showToast(`${values?.eventName} event successfully added.`, SUCCESS);
        formik.resetForm();
        navigate("/");
      }
    }
  };

  /**
   * Method will use of Photon API (Based on OpenStreetMap) 3rd Party API, to suggest the related address to auto complete, entered minimum 3 characters so far
   * Also it contains logic for debounce + abortController which will be best for these kind of scenarios
   * @param {*} e
   */
  const debounceCallbackAutoCompletesAddress = useCallback(
    debounce(async (query) => {
      //Abort the previous API Requests (if any):
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      //Create a new Abort Controller for new request:
      abortControllerRef.current = new AbortController();

      try {
        // console.log("Fetching suggestions for: ", query);
        const photonFeaturesSuggestions = await getSuggestedAddress(
          query,
          abortControllerRef.current.signal
        );
        if (photonFeaturesSuggestions) {
          const locObj = photonFeaturesSuggestions.map((item) => {
            return {
              lat: item.geometry.coordinates[0],
              lng: item.geometry.coordinates[1],
              properties: item.properties,
            };
          });
          // console.log(locObj);
          setSuggestions(locObj);
        }
      } catch (error) {
        if (e.name === "AbortError") {
          // console.log("Old Request has been aborted for query: ", query);
        } else {
          console.error(
            "Error fetching suggested addresses from Photon API - debounceCallbackAutoCompletesAddressHandler():",
            error
          );
        }
      }
    }, 500)
  );

  function onVenueChangeHandler(e) {
    formik.handleChange(e);
    if (e.target.value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceCallbackAutoCompletesAddress(e.target.value.trim());
  }

  // TODO: Debounce API calls (prevents unnecessary calls)
  // useRef(debounce(autoCompletesAddressHandler, 500)).current;

  function buildVenueNameFromDetails(place) {
    let result = "";

    if (place?.name) {
      result = place.name;
    }

    if (place?.street) {
      result += ", " + place.street;
    }

    if (place?.city) {
      result += ", " + place.city;
    }

    if (place?.postcode) {
      result += ", " + place.postcode;
    }

    if (place?.state) {
      result += ", " + place.state;
    }

    if (place?.country) {
      result += ", " + place.country;
    }
    return result;
  }

  const formik = useFormik({
    initialValues: {
      eventName: event?.eventName || "",
      venue: event?.venue || "",
      eventDate: event?.eventDate || new Date(),
      imageUrl: event?.imageUrl || "",
      description: event?.description || "",
    },
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  function onSuggestedListClickHandler(suggestion) {
    // console.log("Clicked onSuggestedListClickHandler()");
    formik.setFieldValue(
      "venue",
      buildVenueNameFromDetails(suggestion.properties)
    );
    selectedVenueDetails.current = suggestion;
    setSuggestions([]);
  }

  return (
    // Form to add or edit an event
    <div className="container card align-items-center justify-content-center bg-app-theme border border-3">
      <h2 className="pt-2">{title}</h2>
      {/* Form fields */}
      <form
        noValidate
        className="row col-12 col-lg-5 gy-2 p-5"
        onSubmit={formik.handleSubmit}
      >
        <div>
          <label htmlFor="eventNameFieldId" className="form-label">
            Event Name*
          </label>
          <input
            id="eventNameFieldId"
            type="text"
            className={`form-control ${
              formik.touched.eventName && formik.errors.eventName
                ? "is-invalid"
                : ""
            } shadow-sm`}
            name="eventName"
            value={formik.values.eventName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <span className="invalid-feedback">{formik.errors.eventName}</span>
        </div>

        <div className="relative-div">
          <label htmlFor="venueFieldId" className="form-label">
            Venue*
          </label>

          <input
            id="venueFieldId"
            type="text"
            name="venue"
            placeholder="e.g. Street, City, Pincode"
            className={`form-control ${
              formik.touched.venue && formik.errors.venue ? "is-invalid" : ""
            } shadow-sm`}
            value={formik.values.venue}
            onBlur={formik.handleBlur}
            onChange={onVenueChangeHandler}
          />

          {suggestions.length > 0 && (
            <ul className="autocomplete-dropdown list-group">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.osm_id + uniqueIncrementNum++}
                  className="autocomplete-item list-group-item list-group-item-action"
                  onClick={() => onSuggestedListClickHandler(suggestion)}
                >
                  {buildVenueNameFromDetails(suggestion.properties)}
                </li>
              ))}
            </ul>
          )}

          <span className="invalid-feedback">{formik.errors.venue}</span>
        </div>

        <div>
          <label htmlFor="eventDateFieldId" className="form-label">
            Event Date-Time*
          </label>
          <input
            id="eventDateFieldId"
            type="datetime-local"
            name="eventDate"
            className={`form-control ${
              formik.touched.eventDate && formik.errors.eventDate
                ? "is-invalid"
                : ""
            } shadow-sm`}
            value={formik.values.eventDate}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <span className="invalid-feedback">{formik.errors.eventDate}</span>
        </div>

        <div>
          <label htmlFor="imgUrlFieldId" className="form-label">
            Image URL
          </label>

          <p
            onClick={() => setisImgTooltipOpen((prevVal) => !prevVal)}
            className="ms-2 btn btn-secondary px-2 py-0 rounded-pill mb-1"
          >
            i
          </p>

          {/* Tooltip Dialog */}
          {isImgTooltipOpen && (
            <div className="d-flex fixed-bottom flex-column position-absolute mt-2 w-90 bg-white shadow-lg rounded p-3 border border-secondary">
              <p className="text-gray-700">
                Steps to Upload an Event Image URL:
                <ol>
                  <li>Search for a relevant event image online.</li>
                  <li>Click on the selected image.</li>
                  <li>
                    Right-click (or tap and hold) on the image and choose{" "}
                    <strong>Copy image address</strong>.
                  </li>
                  <li>Paste the copied link in the provided field.</li>
                </ol>
              </p>
              <button
                onClick={() => setisImgTooltipOpen(false)}
                className="btn btn-danger btn-sm "
              >
                Close
              </button>
            </div>
          )}

          <input
            id="imgUrlFieldId"
            type="text"
            name="imageUrl"
            placeholder="http://example.com"
            className={`form-control ${
              formik.touched.imageUrl && formik.errors.imageUrl
                ? "is-invalid"
                : formik.values.imageUrl.trim() !== ""
                ? "is-valid"
                : ""
            } shadow-sm`}
            value={formik.values.imageUrl}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <span className="invalid-feedback">{formik.errors.imageUrl}</span>
        </div>

        <div>
          <label htmlFor="descriptionFieldId" className="form-label">
            Additional Information
          </label>
          <textarea
            id="descriptionFieldId"
            type="text"
            name="description"
            placeholder="What the event is about and where tickets can be booked (if applicable)."
            className={`form-control ${
              formik.touched.description && formik.errors.description
                ? "is-invalid"
                : ""
            } shadow-sm`}
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <span className="invalid-feedback">{formik.errors.description}</span>
        </div>

        <div className="mt-3 d-flex p-2 align-items-center justify-content-center gap-3 border">
          <input
            type="checkbox"
            id="ackCheckbox"
            onChange={() => {
              setIsAck((prevVal) => !prevVal);
            }}
          />
          <label htmlFor="ackCheckbox" className="mb-0 text-center">
            I accept the <Link to="/">Terms & Conditions</Link>. Uploading
            inappropriate content, including nudity or false information, may
            result in legal action.
          </label>
        </div>

        <button
          className="mt-5 btn btn-primary border border-2  shadow-lg"
          disabled={!isAck || isImgTooltipOpen || formik.isSubmitting}
          type="submit"
        >
          {!isUpdateOperation ? "Post" : "Modify"}
        </button>
      </form>
    </div>
  );
}
