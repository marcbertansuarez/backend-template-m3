const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lineupSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  agent: {
    type: String,
    enum: ['Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Guekko', 'Harbor', 'Jett', 'KAY/O', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru'],
    required: [true, "Agent is required"]
  },
  map: {
    type: String,
    enum: ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus'],
    required: [true, "Map is required"]
  },
  description: {
    type: String,
    required: [true, "A description is required"]
  },
  video: {
    type: String,
    required: [true, "A video is required"]
   },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  });

module.exports = model("LineUp", lineupSchema);