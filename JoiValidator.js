const Joi = require("joi");
const { join } = require("path");

//Listing Validator Scheam
const ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null).required(),
    }),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

//Reviews Validator Schema
const ReviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    createdAt: Joi.date(),
  }).required(),
});

module.exports = { ListingSchema, ReviewSchema };
