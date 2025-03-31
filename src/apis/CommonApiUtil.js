import axios from "axios";

//Dynamic URLs fetch:
export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

export const eventsHubApiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
