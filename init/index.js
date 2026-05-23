const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing");



const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';

main().then(() => {
  console.log("connected database!")
}).catch((error) => {
  console.log(error)
})

async function main() {
  await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({...obj, owner: "69fda723b025b1225226b897"}))
  await listing.insertMany(initdata.data);
  console.log("data was initailize")
}

initDB();