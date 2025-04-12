import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEnvelope,
} from "react-icons/fa";
import { verifyEmailApi } from "../apis/restApis";
import { ERROR, showToast, SUCCESS } from "../utility/CommonUtility";

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const userId = searchParams.get("u");
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending"); // pending, success, error, loading

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    setStatus("loading");
    try {
      // console.log(token, userId);
      if (token) {
        const response = await verifyEmailApi(token, userId);
        if (response.success) {
          setStatus(SUCCESS);
          showToast(response.message, SUCCESS);
          setTimeout(() => navigate("/login"), 2500); // Redirect after 2.5 sec
        } else {
          showToast(response.message, ERROR);
        }
      } else {
        setStatus(ERROR);
        showToast("Invalid Verification.", ERROR);
      }
    } catch (error) {
      setStatus(ERROR);
      showToast("Invalid Verification.", ERROR);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center shadow-lg p-4 verification-box">
        <h2>Email Verification</h2>

        {status === "loading" && (
          <div>
            <FaSpinner className="icon-spin text-primary mb-3" size={50} />
            <p>Verifying your email...</p>
          </div>
        )}

        {status === SUCCESS && (
          <div>
            <FaCheckCircle className="text-success mb-3" size={50} />
            <p>Your email has been successfully verified!</p>
            <p>Redirecting to login...</p>
          </div>
        )}

        {status === ERROR && (
          <div>
            <FaTimesCircle className="text-danger mb-3" size={50} />
            <p>
              Verification failed. Please try again later. If issue persist.
              Please reach out via Email.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=eventshub.parryapplications@gmail.com"
              target="_blank"
              className="btn btn-outline-dark btn-lg d-flex align-items-center justify-content-center gap-2"
            >
              <FaEnvelope size={24} /> Email
            </a>
          </div>
        )}

        {status !== SUCCESS && status !== "loading" && (
          <button className="btn btn-primary mt-3" onClick={verifyEmail}>
            Retry Verification
          </button>
        )}
      </div>
    </div>
  );
}
