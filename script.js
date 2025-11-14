const apiKey = "6ab4972de279e3d971bb5a9b238f984f"; // Your OpenWeatherMap API Key

// ✅ Function 1: Get weather info
async function getWeather() {
  const city = document.getElementById("cityInputWeather").value.trim();
  const lat = document.getElementById("latInput").value.trim();
  const lon = document.getElementById("lonInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");

  if (!city || !lat || !lon) {
    weatherResult.innerHTML = "<p>Please enter city, latitude and longitude.</p>";
    return;
  }

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    const data = await weatherResponse.json();

    if (data.cod !== 200) {
      weatherResult.innerHTML = `<p>${data.message}</p>`;
    } else {
      // ✅ Extract rain possibility (0 if not available)
      const rain = data.rain && data.rain["1h"] ? data.rain["1h"] + " mm (last 1h)" : "No rain";

      weatherResult.innerHTML = `
        <h3>Weather Result for ${city}</h3>
        <p><b>Temperature:</b> ${data.main.temp} °C</p>
        <p><b>Condition:</b> ${data.weather[0].description}</p>
        <p><b>Humidity:</b> ${data.main.humidity}%</p>
        <p><b>Wind Speed:</b> ${data.wind.speed} m/s</p>
        <p><b>Rain Possibility:</b> ${rain}</p>
      `;
    }
  } catch (error) {
    weatherResult.innerHTML = "<p>Something went wrong. Please try again.</p>";
    console.error(error);
  }
}

// ✅ Function 2: Get only coordinates by City
async function getCoordinates() {
  const city = document.getElementById("cityInput").value.trim();
  const cityResult = document.getElementById("cityResult");

  if (!city) {
    cityResult.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      cityResult.innerHTML = "<p>City not found. Please try again.</p>";
      return;
    }

    const { lat, lon } = geoData[0];

    // ✅ Store & show as JSON (lat & lon only)
    const coordJSON = { latitude: lat, longitude: lon };

    cityResult.innerHTML = `
      <h3>Coordinates</h3>
      <pre>${JSON.stringify(coordJSON, null, 2)}</pre>
    `;
  } catch (error) {
    cityResult.innerHTML = "<p>Something went wrong. Please try again.</p>";
    console.error(error);
  }
}
