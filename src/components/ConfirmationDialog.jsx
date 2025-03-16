import React from "react";
import alertIcon from "../assets/alert-icon.svg";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          className="alert-dialog-icon"
          src={alertIcon}
          alt="alert-dialog-icon"
        />

        <p className="py-2">Are you sure?</p>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger" onClick={onClose}>
            Go Back
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
