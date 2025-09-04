const Joi = require("joi");
const { join } = require("path");

const ListingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().allow("", null).required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports = ListingSchema;
