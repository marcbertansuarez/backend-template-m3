const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const likeSchema = new Schema({
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

module.exports = model("Like", likeSchema);