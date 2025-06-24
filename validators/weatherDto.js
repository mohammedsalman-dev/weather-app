import Joi from 'joi';

export const getWeatherSchema = Joi.object({
  address: Joi.string().required()
});

export const saveWeatherSchema = Joi.object({
  address: Joi.string().required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  weatherData: Joi.object().required()
});
