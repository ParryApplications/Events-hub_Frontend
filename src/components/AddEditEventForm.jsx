import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postNewEvent, updateEvent } from "../apis/restApis";
import { useAuth } from "./AuthContext";

export default function AddEditEventForm() {
  const isUpdateOperation = useLocation().pathname.includes("editEvent");
  const navigate = useNavigate();
  const { userDetails, isAuthenticated } = useAuth();

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
    eventName: Yup.string().required("Event Name is required"),
    venue: Yup.string().required("Venue is required"),
    eventDate: Yup.date()
      .min(new Date(), "Only upcoming events are allowed")
      .required("Event Date is required"),
    imageUrl: Yup.string().url("Invalid URL"),
    description: Yup.string().required("About Event is required"),
  });

  /**
   * Method handling the add/update event button event
   * @param {*} values
   */
  const handleFormSubmit = async (values) => {
    console.log("Form submitted with values: ", values);

    if (!isAuthenticated) {
      alert("Please first log in to add or update events.");
      navigate("/signup");
      return;
    }

    if (isUpdateOperation) {
      const reqBody = {
        ...event,
        ...values,
      };
      console.log(reqBody);
      const response = await updateEvent(reqBody);
      if (response) {
        alert("Event updated successfully!");
        formik.resetForm();
        navigate("/");
      } else {
        alert("Failed to update event. Please try again later.");
      }
    } else {
      values.postedByUserId = userDetails.userId;
      values.postedByFullName = userDetails.fullName;
      const response = await postNewEvent(values);
      if (response) {
        alert("Event added successfully!");
        formik.resetForm();
        navigate("/");
      } else {
        alert("Failed to add event. Please try again later.");
      }
    }
  };

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
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    // Form to add or edit an event
    <div className="event-form">
      <h2>{title}</h2>
      {/* Form fields */}
      <form
        noValidate
        className="event-form user-form"
        onSubmit={formik.handleSubmit}
      >
        <input
          type="text"
          placeholder="Event Name"
          name="eventName"
          value={formik.values.eventName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.eventName && formik.errors.eventName && (
          <span className="form-field-error-span">
            {formik.errors.eventName}
          </span>
        )}
        <input
          type="text"
          placeholder="Venue"
          name="venue"
          value={formik.values.venue}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.venue && formik.errors.venue && (
          <span className="form-field-error-span">{formik.errors.venue}</span>
        )}
        <input
          type="datetime-local"
          placeholder="Event Date"
          name="eventDate"
          value={formik.values.eventDate}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.eventDate && formik.errors.eventDate && (
          <span className="form-field-error-span">
            {formik.errors.eventDate}
          </span>
        )}
        <input
          type="text"
          placeholder="Image URL"
          name="imageUrl"
          value={formik.values.imageUrl}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.imageUrl && formik.errors.imageUrl && (
          <span className="form-field-error-span">
            {formik.errors.imageUrl}
          </span>
        )}
        <input
          type="text"
          placeholder="About Event"
          name="description"
          value={formik.values.description}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.description && formik.errors.description && (
          <span className="form-field-error-span">
            {formik.errors.description}
          </span>
        )}
        <button
          className="event-form-button"
          disabled={formik.isSubmitting}
          type="submit"
        >
          {!isUpdateOperation ? "Post" : "Update"}
        </button>
      </form>
    </div>
  );
}
