const express = require("express");
const router = express.Router();
const { ReviewSchema } = require("../JoiValidator.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");

//Validation Function For Reviews
function ReviewValidator(req, res, next) {
  let { error } = ReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
}

//Reviews POST
router.post("/:id/reviews", ReviewValidator, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let review = await new Review(req.body.review);
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.log(err);
  }
});

//Delte Review Route POST
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findOneAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

module.exports = router;
