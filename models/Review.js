const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  lineupId: {
    type: Schema.Types.ObjectId,
    ref: 'LineUp'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  });

module.exports = model("Review", reviewSchema);