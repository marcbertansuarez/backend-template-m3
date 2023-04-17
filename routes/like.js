const router = require("express").Router();
const Like = require("../models/Like");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Like and dislike one line-ups
// @route   POST /like/:lineupId
// @access  Private
router.post("/:lineupId", isAuthenticated, async (req, res, next) => {
  const { lineupId } = req.params;
  const userId = req.payload._id;
  try {
    const like = await Like.findOne({ lineupId, userId });
    if (!like) {
      const newLike = await Like.create({ lineupId, userId });
      res.status(200).json(newLike);
    } else {
      const newLike = await Like.findOneAndDelete({ lineupId, userId });
      res.status(200).json(newLike);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
