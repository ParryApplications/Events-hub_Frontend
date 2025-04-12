import { FaSpinner } from "react-icons/fa";

export default function ProgressBar() {
  return (
    <div
      className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
    >
      <div className="modal-content bg-white rounded-pill p-3 shadow d-flex align-items-center gap-3 flex-column">
        <FaSpinner className="icon-spin text-primary" size={35} />
        <p className="mb-0 text-muted fw-medium">Loading, please wait...</p>
      </div>
    </div>
  );
}
