const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const weatherRoutes = require('./routes/weather');

require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');

app.use('/', weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
