import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logout } from "../apis/restApis";
import EventIcon from "../assets/app-logo-icon.png";

export default function Navigation() {
  const { isAuthenticated, setIsAuthenticated, setUserDetails, userDetails } =
    useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <nav className="px-2 navbar navbar-expand-lg navbar-light shadow-sm mb-2 align-items-center">
        <div className="justify-content-start">
          <Link className="navbar-brand" to={"/"}>
            <img
              src={EventIcon}
              width="30"
              className="d-inline-block align-top mx-1"
              alt="App Icon"
            />
            EventsHub
          </Link>
        </div>

        <button
          className="btn navbar-toggler"
          data-bs-toggle="offcanvas"
          data-bs-target="#nav-offcanvas-items"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-start"
          tab-index="-1"
          id="nav-offcanvas-items"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">EventsHub Menu</h5>
            <button className="btn-close" data-bs-dismiss="offcanvas" />
          </div>

          <div className="offcanvas-body justify-content-end">
            <ul className="navbar-nav mr-0">
              <li className="nav-item active">
                <NavLink className="nav-link" to={"/"}>
                  Home
                </NavLink>
              </li>

              {isAuthenticated === true && (
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/profile"}>
                    Profile
                  </NavLink>
                </li>
              )}

              {isAuthenticated === true && (
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/addEvent"}>
                    Post
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                {isAuthenticated === true ? (
                  <button
                    className="nav-link"
                    onClick={() => {
                      setIsAuthenticated(false);
                      console.log("User Details before logout : ", userDetails);
                      setUserDetails({});
                      logout(); //Remove Authorization headers
                      navigate("/");
                      alert("Loggged out successfully");
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>

          <div className="offcanvas-footer"></div>
        </div>
      </nav>
    </div>
  );
}
