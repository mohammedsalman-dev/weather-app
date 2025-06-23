---

```markdown
# 🌦️ Weather Forecast App

A full-stack Node.js application that provides real-time and historical weather data based on user input. Clean architecture with API key security, input validation, and a beautiful responsive UI.

---

## 🚀 Features

- 🔍 Search weather by **address**
- 📍 Geocoding via **Mapbox API**
- 🌤 Current & hourly forecast via **OpenWeather API**
- 🧾 Save & retrieve weather history
- 🔐 API keys stored securely in the **database**
- ✅ Validation with **Joi**
- ✨ Beautiful **Toastify** notifications & **SpinKit** loader
- 🪵 Logging with **Winston**
- 💅 ESLint + Prettier integration
- 📁 Modular folder structure

---

## 🧑‍💻 Tech Stack

- Backend: **Node.js**, **Express.js**
- Frontend: **HTML**, **Bootstrap**, **jQuery**
- Database: **MySQL**
- APIs: **Mapbox**, **OpenWeather**
- Extras: **Toastify**, **SpinKit**, **Winston**, **Joi**, **ESLint**, **Prettier**

---

## 📁 Project Structure

```

weather-app/
├── db/
│ └── connection.js
├── public/
│ └── main.js
├── routes/
│ ├── weatherRoutes.js
│ └── index.js
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
├── .env.example
├── app.js
└── README.md

```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

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
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=weather_app_db

MAPBOX_API_KEY=your_mapbox_api_key
OPENWEATHER_API_KEY=your_openweather_api_key

MAPBOX_BASE_URL=https://api.mapbox.com
OPENWEATHER_BASE_URL=https://api.openweathermap.org
```

---

### 4. Setup the MySQL Database

```sql
CREATE DATABASE weather_app_db;

-- API keys table
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service VARCHAR(100) NOT NULL UNIQUE,
  key_value TEXT NOT NULL
);

-- Weather history table
CREATE TABLE weather_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255),
  latitude DOUBLE,
  longitude DOUBLE,
  weather_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌱 API Key Seeding (Insert or Update)

This app securely stores API keys in the database instead of hardcoding them in code.

### 🔑 How to seed API keys

Run the seed command to **insert** or **update** (`upsert`) API keys from `.env`:

```bash
npm run seed
```

- ✅ If the key doesn't exist → it will be **inserted**
- 🔁 If the key exists → it will be **updated**

> ⚠️ This makes `npm run seed` idempotent and safe to run multiple times

---

## 🧪 Useful Scripts

| Script           | Description                     |
| ---------------- | ------------------------------- |
| `npm start`      | Run the server with **nodemon** |
| `npm run lint`   | Run **ESLint** for code quality |
| `npm run format` | Format code with **Prettier**   |
| `npm run seed`   | Upsert API keys into database   |

---

## ✅ Assignment Checklist

- [x] Real-time weather via address input
- [x] Save & retrieve historical searches
- [x] API keys managed securely via DB
- [x] Input validation with Joi
- [x] Logs handled with Winston (no `console.log`)
- [x] Toastify notifications and SpinKit loaders
- [x] Code formatting via ESLint & Prettier

---

## 📧 Author

**Mohammed Salman**

- GitHub: [@mohammedsalman-dev](https://github.com/mohammedsalman-dev)
- Email: [mohammad.salman@neosoftmail.com](mailto:mohammad.salman@neosoftmail.com)

---
