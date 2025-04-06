import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logout } from "../apis/restApis";
import EventIcon from "../assets/app-logo-icon.png";
import { useEffect, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { ERROR, showToast, SUCCESS } from "../utility/CommonUtility";
import EventBus from "../utility/EventBus";

export default function Navigation() {
  const { isAuthenticated, setIsAuthenticated, setUserDetails, userDetails } =
    useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState();
  const [faqDivRef, setFaqDivRef] = useState(null);

  useEffect(() => {
    EventBus.on("faqDivRef", (ref) => {
      setFaqDivRef(ref);
    });

    return () => {
      EventBus.off("faqDivRef");
    };
  }, []);

  const clearFaqDivRef = () => setFaqDivRef(null);

  return (
    <div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onConfirm={() => {
          setIsAuthenticated(false);
          console.log("User Details before logout : ", userDetails);
          setUserDetails({});
          const isLogoutSuccess = logout(); //Remove Authorization headers
          navigate("/");

          if (isLogoutSuccess)
            showToast("Logged out successfully. Have a great day!", SUCCESS);
          else showToast("Failed to log out. Please try again later.", ERROR);

          setIsDialogOpen(false);
        }}
        message={"Are you sure you want to logout?"}
      />

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
              <li className="nav-item active" data-bs-dismiss="offcanvas">
                <NavLink className="nav-link" to={"/"}>
                  Home
                </NavLink>
              </li>

              {isAuthenticated === true && (
                <li
                  className="nav-item"
                  data-bs-dismiss="offcanvas"
                  onClick={clearFaqDivRef}
                >
                  <NavLink className="nav-link" to={"/profile"}>
                    Profile
                  </NavLink>
                </li>
              )}

              {isAuthenticated === true && (
                <li
                  className="nav-item"
                  data-bs-dismiss="offcanvas"
                  onClick={clearFaqDivRef}
                >
                  <NavLink className="nav-link" to={"/addEvent"}>
                    Post
                  </NavLink>
                </li>
              )}

              {faqDivRef && faqDivRef?.current && (
                <li
                  className="nav-item nav-link cursor-pointer"
                  data-bs-dismiss="offcanvas"
                  onClick={() => {
                    console.log(faqDivRef);
                    setTimeout(() => {
                      faqDivRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                >
                  FAQ
                </li>
              )}

              <li
                className="nav-item"
                data-bs-dismiss="offcanvas"
                onClick={clearFaqDivRef}
              >
                <NavLink className="nav-link" to={"/about"}>
                  About
                </NavLink>
              </li>

              <li
                className="nav-item"
                data-bs-dismiss="offcanvas"
                onClick={clearFaqDivRef}
              >
                {isAuthenticated === true ? (
                  <button
                    className="nav-link"
                    onClick={() => {
                      setIsDialogOpen(true);
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
