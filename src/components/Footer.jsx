import { Link } from "react-router-dom";
import EventIcon from "../assets/app-logo-icon.png";
import { useAuth } from "./AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <p className="col-md-4 mb-0 text-muted">© 2023 ParryApplications, Inc.</p>

      <Link
        to="/"
        className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <img src={EventIcon} width="40" className="bi me-2" alt="App Icon" />
      </Link>

      <ul className="nav col-md-4 justify-content-end">
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-muted">
            Home
          </Link>
        </li>
        {isAuthenticated && (
          <li className="nav-item">
            <Link to="/profile" className="nav-link px-2 text-muted">
              Profile
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-muted">
            Events
          </Link>
        </li>
        {/* <li className="nav-item">
          <a href="#faq-accordion" className="nav-link px-2 text-muted">
            FAQs
          </a>
        </li> */}
        <li className="nav-item">
          <Link to="/about" className="nav-link px-2 text-muted">
            About
          </Link>
        </li>
      </ul>
    </>
  );
}
