import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary?.(); // optional chaining
    navigate("/"); // Redirects to homepage
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <div
        className="card shadow p-4 text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="mb-3 text-danger">
          <FaExclamationTriangle size={48} />
        </div>
        <h4 className="mb-2">Oops! Something went wrong.</h4>
        <p className="text-muted mb-3">
          {error?.message ||
            "An unexpected error has occurred. Please try again."}
        </p>
        <button className="btn btn-primary" onClick={handleReset}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
