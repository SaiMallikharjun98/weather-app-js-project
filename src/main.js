import "./styles.css";

document.addEventListener("DOMContentLoaded", function () {
  let locationElement = document.querySelector("#location");
  let searchElement = document.querySelector("#search-icon");
  let degreesElement = document.querySelector("#degrees");
  let weatherUpdateElement = document.querySelector("#weather-update");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let videoElement = document.querySelector("#weather-video");
  let videoSource = document.querySelector("#video-source");
  const API_KEY = import.meta.env.VITE_API_KEY;
  async function fetchWeather(city) {
    if (!API_KEY) {
      alert("API Key is missing! Check your .env file.");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      const responseData = await response.text(); // Read response as text first
      console.log("Raw API Response:", responseData);

      if (!response.ok) {
        console.error("API Request Failed:", response.status);
        alert("City not found or API error! Check the console.");
        return;
      }

      const data = JSON.parse(responseData);

      degreesElement.innerText = `${data.main.temp}°C`;
      weatherUpdateElement.innerText = data.weather[0].description;
      feelsLikeElement.innerText = `${data.main.feels_like}°C`;
      humidityElement.innerText = `${data.main.humidity}%`;
      windSpeedElement.innerText = `${data.wind.speed} m/s`;

      const weatherCondition = data.weather[0].main.toLowerCase();
      let newVideoSrc = "./default.mp4";

      if (weatherCondition.includes("rain")) newVideoSrc = "./rain.mp4";
      else if (weatherCondition.includes("cloud")) newVideoSrc = "./cloudy.mp4";
      else if (weatherCondition.includes("clear"))
        newVideoSrc = "./clearSky.mp4";
      else if (weatherCondition.includes("haze")) newVideoSrc = "./Hazy.mp4";
      else if (weatherCondition.includes("snow")) newVideoSrc = "./snow.mp4";
      else if (weatherCondition.includes("sunny")) newVideoSrc = "./sunny.mp4";

      if (videoSource.src !== newVideoSrc) {
        videoSource.src = newVideoSrc;
        videoElement.load();
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("City not found! Please try again.");
    }
  }

  searchElement.addEventListener("click", function () {
    const city = locationElement.value.trim();
    if (city) {
      fetchWeather(city);
    } else {
      alert("Please enter a city name!");
    }
  });

  locationElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchElement.click();
    }
  });
});
