const router = require("express").Router();
const LineUp = require("../models/LineUp");
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Create review to a specific lineup
// @route   POST /review/:lineupId
// @access  Private
router.post("/:lineupId", isAuthenticated, async (req, res, next) => {
  const { lineupId } = req.params;
  const user = req.payload._id;
  const { content } = req.body;
  try {
    const newReview = await Review.create({
      content,
      lineupId: lineupId,
      userId: user,
    });
    await LineUp.findByIdAndUpdate(lineupId, { $inc: { reviewsCount: 1 } });
    res.status(201).json(newReview);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Edit review to a specific lineup
// @route   PUT /review/:reviewId
// @access  Private
router.put("/:reviewId", isAuthenticated, async (req, res, next) => {
  const { reviewId } = req.params;
  const user = req.payload._id;
  const { content } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (review.userId.toString() !== user) {
      res
        .status(403)
        .json({ message: "You are not allowed to edit this review" });
    } else {
      const editedReview = await Review.findByIdAndUpdate(
        reviewId,
        { content },
        { new: true }
      );
      res.status(201).json(editedReview);
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Delete review to a specific lineup
// @route   DELETE /review/:reviewId
// @access  Private
router.delete("/:reviewId", isAuthenticated, async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.payload._id;
  try {
    const review = await Review.findById(reviewId);
    if (review.userId.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    } else {
      const lineupId = review.lineupId;
      await LineUp.findByIdAndUpdate(lineupId, { $inc: { reviewsCount: -1 } });
      const deteledReview = await Review.findByIdAndDelete(reviewId);
      res.status(200).json(deteledReview);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
