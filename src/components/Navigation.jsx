import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function navigate() {
  const { isAuthenticated, setIsAuthenticated, setUserDetails } = useAuth();
  return (
    <>
      <nav className="nav-nav">
        <div className="logo-left-nav-div">
          <Link to={"/"}>EventsHub</Link>
        </div>

        <div className="routes-right-nav-div">
          <NavLink to={"/"}>Home</NavLink>
          {/* <NavLink to={"/events"}>Events</NavLink> */}
          <NavLink to={"/profile"}>Profile</NavLink>
          {isAuthenticated === true ? (
            <button
              className="common-button-to-text"
              onClick={() => {
                setIsAuthenticated(false);
                setUserDetails({});
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
