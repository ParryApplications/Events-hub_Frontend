import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { saveUser } from "../apis/restApis";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  //Form Validations:
  const validFormSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(10, "Password must be at least 10 characters")
      .required("Password is required"),
    // contact: Yup.string().matches(/^\d{10}$/, "Invalid Contact Number"),
    bio: Yup.string(),
  });

  //Form Submission Handler:
  const submitFormHandler = async (values) => {
    //Submit form data to the server
    console.log("Form submitting with Values: ", values);
    const response = await saveUser(values);
    console.log(response);
    formik.resetForm();
    navigate("/login");
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      //   contact: "",
      bio: "",
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: validFormSchema,
    onSubmit: submitFormHandler,
  });

  return (
    <div className="user-form-div">
      <h1>Welcome in our Events Hub App</h1>
      {/* Signup form */}

      <form onSubmit={formik.handleSubmit} className="user-form" noValidate>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formik.values.fullName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <span className="form-field-error-span">
            {formik.errors.fullName}
          </span>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        {formik.touched.email && formik.errors.email && (
          <span className="form-field-error-span">{formik.errors.email}</span>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formik.values.username}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        {formik.touched.username && formik.errors.username && (
          <span className="form-field-error-span">
            {formik.errors.username}
          </span>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        {formik.touched.password && formik.errors.password && (
          <span className="form-field-error-span">
            {formik.errors.password}
          </span>
        )}

        {/* <input
          type="number"
          name="contact"
          placeholder="XXXXXXXXXX"
          value={formik.values.contact}
          onBlur={formik.handleBlur}
           onChange={formik.handleChange}
        />

        {formik.touched.contact && formik.errors.contact && (
          <span className="form-field-error-span">{formik.errors.contact}</span>
        )} */}

        <input
          type="text"
          name="bio"
          placeholder="About Me"
          value={formik.values.bio}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        {formik.touched.bio && formik.errors.bio && (
          <span className="form-field-error-span">{formik.errors.bio}</span>
        )}

        <button type="submit" disabled={formik.isSubmitting}>
          Submit
        </button>
      </form>

      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
