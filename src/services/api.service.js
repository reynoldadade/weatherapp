import axios from "axios";
function createHistoricalWeatherDataRequest(lat, lon) {
  const timeStampRequests = [];
  // last 5 days as timestamps
  for (let i = 5; i > 0; i--) {
    const today = Date.now();
    const days = Math.floor((today - 24 * 60 * 60 * 1000 * i) / 1000);
    const request = axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_WEATHER_APP_ID
      }&units=metric&exclude=hourly&dt=${days}&only_current=true`
    );
    timeStampRequests.push(request);
  }

  return timeStampRequests;
}

// request hostorical weather data together
export async function makeHistoricalWeatherDataRequest(lat, lon) {
  try {
    const responses = await Promise.all(
      createHistoricalWeatherDataRequest(lat, lon)
    );
    return responses.map((response) => response.data);
  } catch ({ error }) {
    console.log(error);
  }
}

export async function getCurrentWeatherData(lat, lon) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_WEATHER_APP_ID
      }&units=metric`
    );
    return response.data;
  } catch ({ error }) {
    console.log(error);
  }
}

export async function getReverseGeoCode(lat, lon) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_WEATHER_APP_ID
      }&limit=1`
    );
    const [first] = response.data;
    return first;
  } catch ({ error }) {
    return null;
  }
}

export async function getGeoCode(place) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/geo/1.0/direct?q=${place}&limit=1&appid=${
        import.meta.env.VITE_WEATHER_APP_ID
      }`
    );
    return response.data;
  } catch (error) {
    return [];
  }
}
