import axios from "axios";

//Dynamic URLs fetch:
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

export const eventsHubApiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
