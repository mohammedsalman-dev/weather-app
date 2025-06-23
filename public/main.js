let currentWeather = null;

function showLoader() {
  $('#loader').show();
}
function hideLoader() {
  $('#loader').hide();
}

$('#searchBtn').on('click', () => {
  const address = $('#addressInput').val().trim();
  if (!address) {
    return Toastify({
      text: '❗ Please enter an address',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#ff6b6b'
    }).showToast();
  }

  $('#resultContainer').empty();
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

      $('#resultContainer').html(`
        <h4 class="mt-4 mb-3">🌤 Current Weather</h4>
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">${data.location}</h5>
            <p><strong>Temp:</strong> ${data.current.temp}°C</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Conditions:</strong> ${data.current.weather[0].description}</p>
          </div>
        </div>
      `);
    })
    .catch((err) => {
      console.error(err);
      hideLoader();
      Toastify({
        text: '❌ Failed to fetch weather',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#ff6b6b'
      }).showToast();
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
      Toastify({
        text: data.message || '✅ Saved successfully',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#4CAF50'
      }).showToast();
    })
    .catch((err) => {
      console.error(err);
      Toastify({
        text: '❌ Failed to save',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#ff6b6b'
      }).showToast();
    });
});

$('#historyBtn').on('click', () => {
  $('#historyContainer').html('');
  showLoader();

  fetch('/api/history')
    .then((res) => res.json())
    .then((data) => {
      hideLoader();
      $('#historyContainer').html('<h4 class="mt-5 mb-3">📜 Weather History</h4>');

      if (!data.length) {
        $('#historyContainer').append('<p>No history found.</p>');
        return;
      }

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
      hideLoader();
      $('#historyContainer').html('<p>❌ Failed to load history</p>');
    });
});
