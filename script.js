const apiKey = "b97a27c8db5a24b23ca3bdeeab6dc87b";
let isCelsius = true;
let currentTempC = null;
let currentFeelsC = null;
let searchHistory = [];

// Weather icon mapping
function getWeatherIcon(condition) {
  const icons = {
    "Clear": "fas fa-sun",
    "Clouds": "fas fa-cloud",
    "Rain": "fas fa-cloud-rain",
    "Drizzle": "fas fa-cloud-drizzle",
    "Thunderstorm": "fas fa-bolt",
    "Snow": "fas fa-snowflake",
    "Mist": "fas fa-smog",
    "Fog": "fas fa-smog",
    "Haze": "fas fa-smog",
  };
  return icons[condition] || "fas fa-cloud";
}

// Format date
function getDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
}

// Get day name for forecast
function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: 'short' });
}

// Display temperature based on unit
function displayTemp(celsius) {
  if (isCelsius) return Math.round(celsius) + "°C";
  return Math.round((celsius * 9/5) + 32) + "°F";
}

// Fetch current weather
function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert("City not found! Please try again.");
        return;
      }

      currentTempC = data.main.temp;
      currentFeelsC = data.main.feels_like;

      document.getElementById("city-name").textContent = data.name + ", " + data.sys.country;
      document.getElementById("date").textContent = getDate();
      document.getElementById("temperature").textContent = displayTemp(currentTempC);
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("humidity").textContent = data.main.humidity + "%";
      document.getElementById("wind").textContent = data.wind.speed + " m/s";
      document.getElementById("feels-like").textContent = displayTemp(currentFeelsC);
      document.getElementById("visibility").textContent = (data.visibility / 1000).toFixed(1) + " km";

      // Set weather icon
      const iconClass = getWeatherIcon(data.weather[0].main);
      document.getElementById("weather-icon").innerHTML = `<i class="${iconClass} fa-3x"></i>`;

      // Add to search history
      addToHistory(city);

      // Fetch forecast
      getForecast(city);
    })
    .catch(err => console.log("Error:", err));
}

// Fetch 5 day forecast
function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastGrid = document.getElementById("forecast-grid");
      forecastGrid.innerHTML = "";

      // Get one forecast per day (every 8th item = 24 hours apart)
      const dailyData = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

      dailyData.forEach(day => {
        const iconClass = getWeatherIcon(day.weather[0].main);
        forecastGrid.innerHTML += `
          <div class="forecast-card">
            <div class="day">${getDayName(day.dt_txt)}</div>
            <i class="${iconClass}"></i>
            <div class="temp">${displayTemp(day.main.temp)}</div>
          </div>
        `;
      });
    })
    .catch(err => console.log("Forecast error:", err));
}

// Search history
function addToHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.unshift(city);
    if (searchHistory.length > 4) searchHistory.pop();
    renderHistory();
  }
}

function renderHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  searchHistory.forEach(city => {
    historyDiv.innerHTML += `
      <button class="history-tag" onclick="getWeather('${city}')">${city}</button>
    `;
  });
}

// Unit toggle
document.getElementById("unit-toggle").addEventListener("click", function() {
  isCelsius = !isCelsius;
  if (currentTempC !== null) {
    document.getElementById("temperature").textContent = displayTemp(currentTempC);
    document.getElementById("feels-like").textContent = displayTemp(currentFeelsC);
  }
});

// Search button
document.getElementById("search-btn").addEventListener("click", function() {
  const city = document.getElementById("city-input").value.trim();
  if (city) getWeather(city);
});

// Press Enter to search
document.getElementById("city-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const city = this.value.trim();
    if (city) getWeather(city);
  }
});

// Load default city
getWeather("Chennai");