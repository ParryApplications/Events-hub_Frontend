import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logout } from "../apis/restApis";

export default function Navigation() {
  const { isAuthenticated, setIsAuthenticated, setUserDetails } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <nav className="nav-nav">
        <div className="logo-left-nav-div">
          <Link to={"/"}>EventsHub</Link>
        </div>

        <div className="routes-right-nav-div">
          <NavLink to={"/"}>Home</NavLink>
          {/* <NavLink to={"/events"}>Events</NavLink> */}
          {isAuthenticated === true && (
            <NavLink to={"/profile"}>Profile</NavLink>
          )}
          {isAuthenticated === true ? (
            <button
              className="common-button-to-text"
              onClick={() => {
                setIsAuthenticated(false);
                setUserDetails({});
                logout();
                navigate("/");
                alert("Loggged out successfully");
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/signup">Signup</NavLink>
          )}
        </div>
      </nav>
      <hr />
    </>
  );
}
