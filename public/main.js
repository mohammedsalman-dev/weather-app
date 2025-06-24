let currentWeather = null;

// Loader control
function showLoader() {
  $('#loader').show();
}
function hideLoader() {
  $('#loader').hide();
}

// Toast helper
function showToast(message, success = true) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: success ? '#4CAF50' : '#ff6b6b'
  }).showToast();
}

// Generate hourly forecast list HTML
function renderHourlyForecast(hourlyData) {
  return hourlyData
    .map((hour) => {
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      const { description, icon } = hour.weather[0];
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      return `
        <li class="list-group-item d-flex align-items-center">
          <img src="${iconUrl}" alt="${description}" class="weather-icon-sm mr-2"/>
          <strong>${time}</strong>: ${hour.temp}°C, ${description}, 💨 ${hour.wind_speed} m/s
        </li>
      `;
    })
    .join('');
}

// Render current weather
function renderCurrentWeather(data) {
  const { description, icon } = data.current.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return `
    <h4 class="mt-4 mb-3 sticky-title">🌤 Weather Details</h4>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body text-center">
            <h5 class="card-title">${data.location}</h5>
            <img src="${iconUrl}" alt="${description}" class="weather-icon mb-3"/>
            <p><strong>${description}</strong></p>
            <p><strong>Temp:</strong> ${data.current.temp}°C</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Wind:</strong> ${data.current.wind_speed} m/s</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body overflow-auto hourly-scroll">
            <h6 class="mb-3">🕒 Hourly Forecast</h6>
            <ul class="list-group list-group-flush">
              ${renderHourlyForecast(data.hourly)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render history entry
function renderWeatherHistory(entry, weather) {
  const { description, icon } = weather.current.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return `
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 text-center">
            <h5 class="card-title">${entry.address}</h5>
            <img src="${iconUrl}" alt="${description}" class="weather-icon mb-3"/>
            <p><strong>${description}</strong></p>
            <p><strong>Temp:</strong> ${weather.current.temp}°C</p>
            <p><strong>Humidity:</strong> ${weather.current.humidity}%</p>
            <p><strong>Wind:</strong> ${weather.current.wind_speed} m/s</p>
            <p><em>${new Date(entry.created_at).toLocaleString()}</em></p>
          </div>

          <div class="col-md-6">
            <h6>🕒 Hourly Forecast</h6>
            <div class="overflow-auto hourly-scroll">
              <ul class="list-group list-group-flush">
                ${renderHourlyForecast(weather.hourly)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Handle Search
$('#searchBtn').on('click', () => {
  const address = $('#addressInput').val().trim();
  if (!address) return showToast('❗ Please enter an address', false);

  $('#resultContainer, #historyContainer').empty();
  $('#saveBtn').prop('disabled', true);
  showLoader();

  fetch('/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })
    .then((res) => res.json())
    .then((data) => {
      currentWeather = data;
      $('#saveBtn').prop('disabled', false);
      hideLoader();
      $('#resultContainer').html(renderCurrentWeather(data));
      $('#addressInput').val('');
    })
    .catch((err) => {
      console.error(err);
      hideLoader();
      showToast('❌ Failed to fetch weather', false);
    });
});

// Handle Save
$('#saveBtn').on('click', () => {
  if (!currentWeather) return alert('Search first.');

  fetch('/api/save-weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: currentWeather.location,
      lat: currentWeather.lat,
      lon: currentWeather.lon,
      weatherData: currentWeather
    })
  })
    .then((res) => res.json())
    .then((data) => {
      showToast(data.message || '✅ Saved successfully');
    })
    .catch((err) => {
      console.error(err);
      showToast('❌ Failed to save', false);
    });
});

// Handle History
$('#historyBtn').on('click', () => {
  $('#resultContainer, #historyContainer').empty();
  $('#addressInput').val('');
  $('#saveBtn').prop('disabled', true);
  showLoader();

  fetch('/api/history')
    .then((res) => res.json())
    .then((data) => {
      hideLoader();
      $('#historyContainer').html('<h4 class="mt-5 mb-3 sticky-title">📜 Weather History</h4>');

      if (!data.length) {
        $('#historyContainer').append('<p>No history found.</p>');
        return;
      }

      data.forEach((entry) => {
        const weather =
          typeof entry.weather_data === 'string'
            ? JSON.parse(entry.weather_data)
            : entry.weather_data;
        $('#historyContainer').append(renderWeatherHistory(entry, weather));
      });
    })
    .catch((err) => {
      console.error(err);
      hideLoader();
      $('#historyContainer').html('<p>❌ Failed to load history</p>');
    });
});
