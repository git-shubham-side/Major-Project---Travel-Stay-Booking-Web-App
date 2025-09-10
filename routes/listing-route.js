const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const { ListingSchema } = require("../JoiValidator.js");
const ExpressError = require("../utils/ExpressError.js");

//Validation Function for Listing
function listingValidator(req, res, next) {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    console.log(req.body);
    console.log("Listing Middleware probem");
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
}

//Routing ---------- Index Route
// router.get("/", (req, res) => {
//   res.redirect("/listings");
// });

//Index Route ----------------
router.get("/", async (req, res) => {
  try {
    let alllist = await Listing.find({});
    res.render("listings/index", { alllist });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//New Route--------------
router.get("/new", (req, res) => {
  res.render("listings/create");
});

//Show Route-----------------
router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = await Listing.findById(id).populate("reviews");

    res.render("listings/show", { data });
  } catch (err) {
    next(err);
  }
});

//Create Route---  & Joi Middleware as ListingValidator
router.post("/", listingValidator, async (req, res, next) => {
  try {
    let listing = await new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

//Edit Route-----------
router.get("/:id/edit", async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id);
  res.render("listings/edit", { data });
});

//Edit PUT Route & Joi Listing Validator
router.put("/:id", listingValidator, async (req, res) => {
  let id = req.params.id;
  let listing = req.body.listing;

  await Listing.findByIdAndUpdate(id, listing, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/listings/${id}`);
});

//Destroy Route--Delete Route------
router.delete("/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Listing.findByIdAndDelete(id);
    if (result) {
      res.redirect("/listings");
    } else {
      console.log("Listing Not Found!");
    }
  } catch (err) {
    // console.log("Error Catch", err);
    next(new ExpressError(409, "Error Occured!"));
  }
});

module.exports = router;
