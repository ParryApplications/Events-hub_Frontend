import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../apis/restApis";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getGreeting, showToast, SUCCESS } from "../utility/CommonUtility";

export default function Login() {
  const navigate = useNavigate();
  const { setUserDetails, setIsAuthenticated } = useAuth();

  const validationFormSchema = Yup.object({
    username: Yup.string().required("Username is Required"),
    password: Yup.string().required("Password is Required"),
  });

  async function submitHandler(values) {
    // Submit form data to the server
    // console.log("Form is submitting with Values: ", values);
    const response = await login(values);
    if (response && Object.keys(response).length > 0) {
      // console.log(response);
      setUserDetails(response);
      setIsAuthenticated(true);
      navigate("/");
      showToast(
        `Hi ${response.fullName.split(" ")[0]}, ${getGreeting()}`,
        SUCCESS
      );
    } else {
      alert("Invalid username or password");
    }
    formik.resetForm();
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationFormSchema,
    onSubmit: submitHandler,
    validateOnBlur: true,
    validateOnChange: false,
  });

  return (
    <div className="container card align-items-center justify-content-center bg-app-theme border border-3">
      {/* <h2>Welcome Back, Login</h2> */}
      <form
        noValidate
        className="row col-12 col-lg-5 gy-2 p-5"
        onSubmit={formik.handleSubmit}
      >
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
                : ""
            } shadow-sm`}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <span className="invalid-feedback">{formik.errors.password}</span>
          <span className="valid-feedback">Looks Good</span>
        </div>

        <button
          className="mt-4 btn btn-primary border border-2 shadow-lg"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Login
        </button>
      </form>

      <p className="d-flex gap-1">
        New Here?{" "}
        <Link className="btn btn-outline-secondary py-0 px-2" to="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
