//Nominatim API:

import axios from "axios";

const PHOTON_BASE_URL = "https://photon.komoot.io";

const photonClient = axios.create({
  baseURL: PHOTON_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Implement logic to fetch suggested addresses using Photon API (Based on OpenStreetMap)
 * Return an array of suggested addresses + abortedController Signal
 * @param {*} query
 */
export async function getSuggestedAddress(query, abortControllerSignal) {
  try {
    const response = await photonClient.get(
      `https://photon.komoot.io/api/?q=${query}&limit=5`,
      { abortControllerSignal }
    );
    // console.log(response.data);
    if (response.data && response.data.features.length > 0) {
      return response.data.features;
    }

    return undefined;
  } catch (e) {
    if (e.name === "AbortError") {
      // console.log("Old Request has been aborted for query: ", query);
    } else {
      console.error(
        `Error fetching suggested addresses from Photon API - getSuggestedAddress(): ${e.message}`
      );
    }
    return undefined;
  }
}
