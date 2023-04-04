const Like = require("../models/Like");

module.exports = async (lineup, user) => {
  if (user) {
    const isLiked = await Like.findOne({
      lineupId: lineup._id,
      userId: user._id,
    });
    if (isLiked) {
      lineup.isLiked = true;
    }
  }
  lineup.numberOfLikes = (await Like.find({ lineupId: lineup._id })).length;
  return lineup;
};
