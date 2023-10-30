document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".locationInput");
  const btn = document.querySelector(".weather-btn");
  const currentDescription = document.querySelector(
    ".current-weather-description"
  );
  const currentTemp = document.querySelector(".current-temperature");
  const currentDate = document.querySelector(".current-date");
  const currentLocation = document.querySelector(".current-location-text");
  const windStatus = document.querySelector(".wind-status");
  const humidityStatus = document.querySelector(".humidity");
  const visibilityStatus = document.querySelector(".visibility");
  const pressureStatus = document.querySelector(".air-pressure");

  const getWeather = async () => {
    const defaultLocation = "accra";

    try {
      const location = input.value || defaultLocation;
      const r = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=HMG46QMCWL33BVNPH78JACBKY&contentType=json`,
        { mode: "cors" }
      );
      const data = await r.json();
      updateDivs(data);
      updateBg(data);
    } catch (error) {
      convertToCoordinates();
    }
  };

  const convertToCoordinates = async () => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          input.value
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
    updateDivs(data);
    updateBg(data);
  };

  const updateDivs = (weatherData) => {
    const forecastDivs = document.querySelectorAll(".forecast");
    const celsiusSymbol = "\u00B0C";

    currentDescription.innerHTML = `<p>${weatherData.currentConditions.conditions}</p>`;
    currentTemp.innerHTML = `<p>${weatherData.currentConditions.feelslike} ${celsiusSymbol}</p>`;
    currentDate.innerHTML = `<p>${weatherData.days[0].datetime}</p>`;
    currentLocation.innerHTML = `<p>${weatherData.resolvedAddress}</p>`;

    windStatus.innerHTML = `<p>Wind Status</p> <p>${weatherData.currentConditions.windspeed} mph</p>`;
    humidityStatus.innerHTML = `<p>Humidity</p> <p>${weatherData.currentConditions.humidity} %</p>`;
    visibilityStatus.innerHTML = `<p>Visibility</p> <p>${weatherData.currentConditions.visibility} miles</p>`;
    pressureStatus.innerHTML = `<p>Air pressure</p> <p>${weatherData.currentConditions.pressure} mb</p>`;

    const arr = [...forecastDivs];

    arr.map((day, i) => {
      day.innerHTML = `      
      <p>${weatherData.days[i].datetime}</p>
      <div class="high-low">
        <div class="high">H: ${weatherData.days[i].tempmax} ${celsiusSymbol}</div>
        <div class="low">L: ${weatherData.days[i].tempmin} ${celsiusSymbol}</div>
      </div>`;
    });
  };

  const updateBg = (weatherData) => {
    const cloudyUrl = "/weather-app/assets/images/conditions/cloudbg.svg";
    const rainyUrl = "/weather-app/assets/images/conditions/rainbg.svg";
    const clearUrl = "/weather-app/assets/images/conditions/Clear.svg";
    const snowUrl = "/weather-app/assets/images/conditions/snowbg.svg";
    const sleetUrl = "/weather-app/assets/images/conditions/Sleet.svg";
    const hailUrl = "/weather-app/assets/images/conditions/hail.svg";
    const thunderStorm =
      "/weather-app/assets/images/conditions/Thunderstorm.svg";

    const conditions = weatherData.currentConditions.conditions.toLowerCase();

    if (conditions.includes("cloudy")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${cloudyUrl})`);
    } else if (conditions.includes("rain")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${rainyUrl})`);
    } else if (conditions.includes("clear")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${clearUrl})`);
    } else if (conditions.includes("snow")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${snowUrl})`);
    } else if (conditions.includes("sleet")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${sleetUrl})`);
    } else if (conditions.includes("hail")) {
      currentWeatherPane.style.setProperty("--bg-image", `url(${hailUrl})`);
    } else if (conditions.includes("thunderstorm")) {
      currentWeatherPane.style.setProperty(
        "--bg-image",
        `url(${thunderStorm})`
      );
    }
  };

  getWeather();

  // Nav
  const searchPane = document.querySelector(".search-pane");
  const searchBtn = document.querySelector(".search-btn");
  const closeBtn = document.querySelector(".close-btn");
  const currentWeatherPane = document.querySelector(".current-weather");

  const hideSearchPane = () => {
    searchPane.style.display = "none";
    currentWeatherPane.style.display = "grid";
  };

  const showSearchPane = () => {
    searchPane.style.display = "grid";
    currentWeatherPane.style.display = "none";
  };

  closeBtn.addEventListener("click", hideSearchPane);
  searchBtn.addEventListener("click", showSearchPane);

  input.addEventListener("change", getWeather);
  btn.addEventListener("click", getWeather);
  btn.addEventListener("click", hideSearchPane);
});
