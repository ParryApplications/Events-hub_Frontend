import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../apis/restApis";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUserDetails, setIsAuthenticated } = useAuth();

  const validationFormSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  async function submitHandler(values) {
    // Submit form data to the server
    console.log("Form is submitting with Values: ", values);
    const response = await login(values);
    if (response && Object.keys(response).length > 0) {
      setUserDetails(response);
      setIsAuthenticated(true);
      navigate("/");
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
    <div className="user-form-div">
      <h2>Welcome Back, Login</h2>
      <form noValidate className="user-form" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />

        {formik.touched.username && formik.errors.username && (
          <span className="form-field-error-span">
            {formik.errors.username}
          </span>
        )}

        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />

        {formik.touched.password && formik.errors.password && (
          <span className="form-field-error-span">
            {formik.errors.password}
          </span>
        )}
        <button type="submit" disabled={formik.isSubmitting}>
          Login
        </button>
      </form>
    </div>
  );
}
