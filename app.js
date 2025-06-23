const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
require('dotenv').config();

const app = express();
const db = require('./db/connection');
const weatherRoutes = require('./routes/weather');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');

app.use('/', weatherRoutes);

// ✅ DB check and start server
async function startServer() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✅ MySQL connected successfully.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1); // Exit the app
  }
}

startServer();
