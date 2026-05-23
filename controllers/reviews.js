const listing = require("../models/listing")
const Review = require("../models/review")

// review -> post route
module.exports.reviewpost = async (req, res) => {
  let Listing = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  Listing.reviews.push(newReview);
  await newReview.save();
  await Listing.save();
  req.flash("scuess", "New Review Created!")
  res.redirect(`/listings/${Listing._id}`);
}

// delete route for review
module.exports.destroyreview = async (req, res) => {
  let { id, reviewsId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } });
  await Review.findByIdAndDelete(reviewsId);
  req.flash("scuess", "Review Deleted!")
  res.redirect(`/listings/${id}`)
}