const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//Listing Model require
const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");
const { engine } = require("express/lib/application");
const ExpressError = require("./utils/ExpressError.js");

//Joi Validator
const Joi = require("joi");
const ListingSchema = require("./JoiValidator.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Database Connection ----------
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then((res) => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//Validation Function
function listingValidator(req, res, next) {
  let { error } = ListingSchema.validate(req.body.listing);
  if (error) {
    throw new ExpressError(400, error.message);
  } else {
    next();
  }
}

//Routing ----------
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//Index Route ----------------
app.get("/listings", async (req, res) => {
  try {
    let alllist = await Listing.find({});
    res.render("listings/index", { alllist });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//New Route--------------
app.get("/listings/new", (req, res) => {
  res.render("listings/create");
});

//Show Route-----------------
app.get("/listings/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = await Listing.findById(id);
    res.render("listings/show", { data });
  } catch (err) {
    next(err);
  }
});

//Create Route---  & Joi Middleware as ListingValidator
app.post("/listings", listingValidator, async (req, res, next) => {
  try {
    let listing = await new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

//Edit Route-----------
app.get("/listings/:id/edit", async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id);
  res.render("listings/edit", { data });
});

//Edit PUT Route & Joi Listing Validator
app.put("/listings/:id", listingValidator, async (req, res) => {
  let id = req.params.id;
  let listing = req.body.listing;

  await Listing.findByIdAndUpdate(id, listing, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/listings/${id}`);
});

//Destroy Route--Delete Route------
app.delete("/listings/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Listing.findByIdAndDelete(id);
    if (result) {
      console.log("Listing  is deleted", result);
      res.redirect("/listings");
    } else {
      console.log("Listing Not Found!");
    }
  } catch (err) {
    // console.log("Error Catch", err);
    next(new ExpressError(409, "Error Occured!"));
  }
});

//Reviews
app.post("/listings/:id/reviews", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let review = await new Review(req.body.review);

    listing.reviews.push(review);

    await review.save();
    await listing.save();
    res.json({ request: "Accepted" });
  } catch (err) {
    console.log(err);
  }
});

//Random routes error
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not found!"));
  // res.render("/listings/error");
});

// error handling middleware of create Route
app.use((err, req, res, next) => {
  // console.log(err);
  let { statusCode = 500, message } = err;
  // console.log(statusCode, message);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Server is Listning on PORT ${PORT}`);
});
