import React from "react";

import { FaExclamationCircle } from "react-icons/fa";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  if (!message || message.trim() === "") {
    message = "Are you sure?";
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* <img
          className="alert-dialog-icon"
          src={alertIcon}
          alt="alert-dialog-icon"
        /> */}

        <FaExclamationCircle size={30} className="alert-dialog-icon" />

        <p className="py-2">{message}</p>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger" onClick={onClose}>
            No
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
