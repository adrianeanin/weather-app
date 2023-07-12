document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".locationInput");
  const btn = document.querySelector(".weatherBtn");

  let location;

  const getWeather = async () => {
    location = input.value;
    console.log(location);
    console.log("Button clicked");
    try {
      const r = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=HMG46QMCWL33BVNPH78JACBKY&contentType=json`,
        { mode: "cors" }
      );
      const data = await r.json();
      console.log(data);
    } catch (error) {
      convertToCoordinates();
    }
  };

  const convertToCoordinates = async () => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          (location = input.value)
        )}&format=json&limit=1`
      );

      const data = await r.json();

      const latitude = data[0].lat;
      const longitude = data[0].lon;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      fetchWithCoordinates(latitude, longitude);
    } catch {
      (error) => {
        console.log("failed");
        console.log("Error converting location:", error);
      };
    }
  };

  const fetchWithCoordinates = async (latitude, longitude) => {
    const r = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=HMG46QMCWL33BVNPH78JACBKY&contentType=json`,
      { mode: "cors" }
    );
    const data = await r.json();
    return console.log(data);
  };

  btn.addEventListener("click", getWeather);
});
