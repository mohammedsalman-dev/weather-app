import express from 'express';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';

import db from './db/connection.js';
import { weatherRoutes } from './routes/index.js';

import logger from './logger.js';
dotenv.config();

const app = express();

// Static, form parsing, JSON
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Nunjucks template engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'njk');

// Routes
app.use('/', weatherRoutes);

// DB check and start server
async function startServer() {
  try {
    await db.query('SELECT 1');
    logger.info('✅ MySQL connected successfully.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
