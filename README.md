---

```markdown
# 🌦️ Weather Forecast App

This is a full-stack weather forecast application that allows users to:

- Search for real-time weather information by address.
- View hourly forecasts.
- Save search results.
- View history of saved weather data.

## 🚀 Features

- 🌍 Address geocoding using **Mapbox API**
- 🌤 Current and hourly weather data using **OpenWeather API**
- 🛢️ MySQL database integration for storing search history
- 🧾 API key management via database (not hardcoded)
- 🧼 Input validation using **Joi**
- ✨ Beautiful UI with Toastify and SpinKit for toasts and loaders
- 📦 Modular project structure with services and middlewares
- 🪵 Logging with **Winston**

---

## 🧑‍💻 Tech Stack

- Backend: **Node.js**, **Express.js**
- Database: **MySQL**
- Frontend: **HTML**, **Bootstrap**, **jQuery**
- APIs: **Mapbox**, **OpenWeather**
- Extras: **ESLint**, **Prettier**, **Toastify**, **SpinKit**, **Winston**

---

## 📁 Project Structure

```

weather-app/
├── db/
│ └── connection.js
├── public/
│ └── main.js
├── routes/
│ └── weatherRoutes.js
├── services/
│ ├── weatherService.js
│ ├── weatherDbService.js
│ └── apiKeyService.js
├── validators/
│ └── weatherDto.js
├── middlewares/
│ └── validate.js
├── views/
│ └── index.njk
├── scripts/
│ └── seed.js
├── .env
├── app.js
└── README.md

```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/mohammedsalman-dev/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file based on `.env.example`:

```env
# .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=weather_app_db
MAPBOX_BASE_URL=https://api.mapbox.com
OPENWEATHER_BASE_URL=https://api.openweathermap.org
```

### 4. Setup database

```sql
CREATE DATABASE weather_app_db;

-- Create tables
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service VARCHAR(100) NOT NULL,
  key_value TEXT NOT NULL
);

CREATE TABLE weather_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255),
  latitude DOUBLE,
  longitude DOUBLE,
  weather_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Seed your API keys

```bash
node scripts/seed.js
```

Or update later with:

```bash
node scripts/updateKeys.js
```

### 6. Run the application

```bash
npm start
```

---

## 🧪 Useful Commands

```bash
npm run start      # Start app with nodemon
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run seed       # Seed API Keys from .env file
```

---

## 📚 Notes

- API keys are securely stored in the database.
- Input validation is handled using **Joi**.
- Project follows modular and scalable architecture.

---

## ✅ Assignment Checklist

- [x] Real-time weather using address ✅
- [x] Save and view past searches ✅
- [x] Code structured and reusable ✅
- [x] API keys not hardcoded ✅
- [x] Environment config via `.env` ✅
- [x] Beautiful UI feedback with toasts/loaders ✅

---

## 📧 Author

**Your Name**
[GitHub](https://github.com/mohammedsalman-dev) | [Email](mailto:mohammad.salman@neosoftmail.com)

---
