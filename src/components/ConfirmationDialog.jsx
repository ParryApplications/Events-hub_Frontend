import React from "react";

import { FaExclamationCircle } from "react-icons/fa";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  if (!message || message.trim() === "") {
    message = "Are you sure?";
  }

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content p-4 rounded shadow-lg bg-white text-center"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <FaExclamationCircle
          size={40}
          className="text-warning mb-3 align-self-center"
        />

        <p className="fw-semibold fs-5 mb-4">{message}</p>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-outline-secondary px-4" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary px-4" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
