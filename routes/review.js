const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")
// Reviews -> post route
router.post("/", isLoggedIn, validatereview, wrapAsync(reviewController.reviewpost));

// delete reviews route
router.delete("/:reviewsId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyreview))

module.exports = router;