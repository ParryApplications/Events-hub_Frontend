import axios from "axios";

//Constants:
export const BACKEND_BASE_URL = "http://localhost:8081/events-hub";
export const FRONTEND_BASE_URL = "http://localhost:5173";

export const eventsHubApiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
