// intializations
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema
const cakeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    "8 inch": Number,
    "10 inch": Number,
    "12 inch": Number,
  },
  image: {
    type: String,
    required: true,
  },
});

// exporting
const Cake = mongoose.model("Cake", cakeSchema);
module.exports = Cake;
