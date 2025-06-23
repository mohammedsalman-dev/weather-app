const Joi = require('joi');

const getWeatherSchema = Joi.object({
  address: Joi.string().required()
});

const saveWeatherSchema = Joi.object({
  address: Joi.string().required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  weatherData: Joi.object().required()
});

module.exports = {
  getWeatherSchema,
  saveWeatherSchema
};
