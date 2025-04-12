import { useFormik } from "formik";
import * as Yup from "yup";
import { saveUser } from "../apis/restApis";
import { Link, useNavigate } from "react-router-dom";
import { ERROR, showToast, SUCCESS } from "../utility/CommonUtility";
import ProgressBar from "./ProgressBar";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  //Form Validations:
  const validFormSchema = Yup.object({
    fullName: Yup.string().required("Full Name is Required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email is Required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(10, "Password must be at least 10 characters")
      .required("Password is Required"),
    bio: Yup.string(),
  });

  //Form Submission Handler:
  const submitFormHandler = async (values) => {
    setLoading(true);
    const response = await saveUser(values);

    setLoading(false);

    if (response.success && response.data) showToast(response.message, SUCCESS);
    else showToast(response.message, ERROR);

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
    validateOnChange: true,
    validationSchema: validFormSchema,
    onSubmit: submitFormHandler,
  });

  return (
    <>
      {isLoading && <ProgressBar />}

      <div className="container card align-items-center justify-content-center bg-app-theme border border-3">
        {/* <h2>Welcome in our Events Hub App</h2>
      Signup form */}
        <form
          onSubmit={formik.handleSubmit}
          className="row col-12 col-lg-5 gy-2 p-5"
          noValidate
        >
          <div>
            <label htmlFor="fullNameFieldId" className="form-label">
              Full Name*
            </label>
            <input
              id="fullNameFieldId"
              type="text"
              name="fullName"
              autoComplete="name"
              className={`form-control ${
                formik.touched.fullName && formik.errors.fullName
                  ? "is-invalid"
                  : formik.values.fullName.trim() !== ""
                  ? "is-valid"
                  : ""
              } shadow-sm`}
              value={formik.values.fullName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <span className="invalid-feedback">{formik.errors.fullName}</span>
          </div>
          <div>
            <label htmlFor="emailFieldId" className="form-label">
              Email*
            </label>
            <input
              id="emailFieldId"
              type="email"
              autoComplete="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email
                  ? "is-invalid"
                  : formik.values.email.trim() !== ""
                  ? "is-valid"
                  : ""
              }  shadow-sm`}
              name="email"
              placeholder="name@example.com"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <span className="invalid-feedback">{formik.errors.email}</span>
            <span className="valid-feedback">Looks Good</span>
          </div>
          <div>
            <label htmlFor="usernameFieldId" className="form-label">
              Username*
            </label>
            <div className="input-group">
              <span className="input-group-text shadow-sm">@</span>
              <input
                id="usernameFieldId"
                type="text"
                autoComplete="username"
                className={`form-control ${
                  formik.touched.username && formik.errors.username
                    ? "is-invalid"
                    : formik.values.username.trim() !== ""
                    ? "is-valid"
                    : ""
                } shadow-sm`}
                name="username"
                value={formik.values.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="invalid-feedback">{formik.errors.username}</span>
            </div>
          </div>

          <div>
            <label htmlFor="passwordFieldId" className="form-label">
              Password*
            </label>
            <input
              id="passwordFieldId"
              type="password"
              name="password"
              autoComplete="current-password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : formik.values.password.trim() !== "" &&
                    formik.values.password.length > 9
                  ? "is-valid"
                  : ""
              } shadow-sm`}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <span className="invalid-feedback">{formik.errors.password}</span>
            <span className="valid-feedback">Looks Good</span>
          </div>
          <div>
            <label htmlFor="bioFieldId" className="form-label">
              About
            </label>
            <input
              id="bioFieldId"
              type="text"
              placeholder="Tell us a bit about you..."
              className={`form-control ${
                formik.touched.bio && formik.errors.bio ? "is-invalid" : ""
              } shadow-sm`}
              name="bio"
              value={formik.values.bio}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <span className="invalid-feedback">{formik.errors.bio}</span>
            <span className="valid-feedback">Looks Good</span>
          </div>
          <button
            type="submit"
            className="mt-5 btn btn-primary border border-2  shadow-lg"
            disabled={formik.isSubmitting}
          >
            Submit
          </button>
        </form>
        <p className="d-flex gap-1">
          Already have an account?{" "}
          <Link className="btn btn-outline-secondary py-0 px-2" to="/login">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
