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
const { engine, all } = require("express/lib/application");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing-route.js");
const reviews = require("./routes/reviews-routes.js");

//Joi Validator
const Joi = require("joi");
const { ListingSchema } = require("./JoiValidator.js");
const { ReviewSchema } = require("./JoiValidator.js");

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

//Listing Routes--
app.use("/listings", listings);
//Reviews Routes--
app.use("/listings", reviews);

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
