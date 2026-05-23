const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js")
const listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

// new route
router.get("/new", isLoggedIn, listingController.renderNew)

router.route("/")
  .get(wrapAsync(listingController.index)) // index route
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.create)); // create route


router.route("/:id")
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.update)) // update route
  .get(wrapAsync(listingController.show)) // show route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)) // delete route

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit))



module.exports = router;