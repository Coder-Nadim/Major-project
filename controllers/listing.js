const listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index route
module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  res.render("listings/index", { allListing });
}

// new route
module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs")
}


// edit route
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const foundlisting = await listing.findById(id);
  if (!foundlisting) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings")
  }

  let originalImageUrl = foundlisting.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250")
  res.render("listings/edit.ejs", { foundlisting, originalImageUrl });
}

// update route
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("scuess", "Listing Updated!")
  res.redirect(`/listings/${id}`);
}

// show route 
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const foundlisting = await listing.findById(id).populate({
    path: "reviews", populate: {
      path: "author",
    }
  })
    .populate("owner");
  if (!foundlisting) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings")
  }
  res.render("listings/show", { foundlisting });
}

// create route
module.exports.create = async (req, res, next) => {
  let responce = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2
    })
    .send();
  


  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = responce.body.features[0].geometry;
  
  let savedListing = await newListing.save();
console.log(savedListing)
  req.flash("scuess", "New Listing Created!")
  res.redirect("/listings")
}

// delete route
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("scuess", "Listing Deleted!")
  res.redirect("/listings")
}