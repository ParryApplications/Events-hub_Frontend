import { createContext, useContext, useEffect, useState } from "react";
import { eventsHubApiClient } from "../apis/CommonApiUtil";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("htua");
    const authKey = localStorage.getItem("htuacreds");
    if (auth && authKey) {
      const parsedAuth = JSON.parse(auth);
      eventsHubApiClient.defaults.headers["Authorization"] = authKey;
      setUserDetails(parsedAuth);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
