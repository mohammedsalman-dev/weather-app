let currentWeather = null;

$('#searchBtn').on('click', () => {
  const address = $('#addressInput').val().trim();
  if (!address) return alert('❗ Please enter an address');

  fetch('/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })
    .then((res) => res.json())
    .then((data) => {
      currentWeather = data;
      $('#saveBtn').prop('disabled', false);

      $('#resultContainer').html(`
        <h4 class="mt-4 mb-3">🌤 Current Weather</h4>
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">${data.location}</h5>
            <p><strong>Temp:</strong> ${data.current.temp}°C</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Conditions:</strong> ${data.current.weather[0].description}</p>
        </div>
      `);
    })
    .catch((err) => {
      console.error(err);
      alert('❌ Failed to fetch weather');
    });
});

$('#saveBtn').on('click', () => {
  if (!currentWeather) return alert('Search first.');

  const payload = {
    address: currentWeather.location,
    lat: currentWeather.lat,
    lon: currentWeather.lon,
    weatherData: currentWeather
  };

  fetch('/api/save-weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || '✅ Saved');
    })
    .catch((err) => {
      console.error(err);
      alert('❌ Failed to save');
    });
});

$('#historyBtn').on('click', () => {
  $('#historyContainer').html('<p>Loading...</p>');

  fetch('/api/history')
    .then((res) => res.json())
    .then((data) => {
      $('#historyContainer').html('<h4 class="mt-5 mb-3">📜 Weather History</h4>');

      data.forEach((entry) => {
        const weather =
          typeof entry.weather_data === 'string'
            ? JSON.parse(entry.weather_data)
            : entry.weather_data;

        $('#historyContainer').append(`
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${entry.address}</h5>
              <p><strong>Temp:</strong> ${weather.current.temp}°C</p>
              <p><strong>Humidity:</strong> ${weather.current.humidity}%</p>
              <p><strong>Weather:</strong> ${weather.current.weather[0].description}</p>
              <p><em>${new Date(entry.created_at).toLocaleString()}</em></p>
            </div>
          </div>
        `);
      });
    })
    .catch((err) => {
      console.error(err);
      $('#historyContainer').html('<p>❌ Failed to load history</p>');
    });
});
