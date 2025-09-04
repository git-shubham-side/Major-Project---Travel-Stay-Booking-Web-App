const { default: mongoose } = require("mongoose");
const moonoose = require("mongoose");

const reviewSchema = new moonoose.Schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
