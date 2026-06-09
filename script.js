const apiKey = "24d0db05a10836146373e6dfbde4e922";

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("city-name").textContent = data.name;
      document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°C";
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("humidity").textContent = data.main.humidity + "%";
      document.getElementById("wind").textContent = data.wind.speed + " m/s";
      document.getElementById("feels-like").textContent = Math.round(data.main.feels_like) + "°C";
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

document.getElementById("search-btn").addEventListener("click", function() {
  const city = document.getElementById("city-input").value;
  if (city) {
    getWeather(city);
  }
});