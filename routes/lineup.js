const router = require("express").Router();
const LineUp = require("../models/LineUp");
const Review = require("../models/Review");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const getLikes = require("../utils/likesHelper");
const Like = require("../models/Like");

// @desc    Get all line-ups
// @route   GET /lineup
// @access  Private
router.get("/", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  try {
    const lineups = await LineUp.find({}).populate("author");
    const prePromiseLineUps = JSON.parse(JSON.stringify(lineups));
    const lineupLikes = await Promise.all(
      prePromiseLineUps.map(async (lineup) => {
        return await getLikes(lineup, user);
      })
    );
    const sortedLineups = lineupLikes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json(sortedLineups);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Get all line-ups
// @route   GET /lineup/lineup
// @access  Public (No user login)
router.get("/lineup", async (req, res, next) => {
  try {
    const lineups = await LineUp.find({}).populate("author");
    const prePromiseLineUps = JSON.parse(JSON.stringify(lineups));
    const lineupLikes = await Promise.all(
      prePromiseLineUps.map(async (lineup) => {
        return await getLikes(lineup, null);
      })
    );
    const sortedLineups = lineupLikes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json(sortedLineups);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Search lineups for agents
// @route   GET lineup/search
// @access  Public
router.get("/search", async (req, res, next) => {
  const { agent } = req.query;
  try {
    const searchResult = await LineUp.find({ agent: agent }).populate("author");
    const prePromiseLineUps = JSON.parse(JSON.stringify(searchResult));
    const lineupLikes = await Promise.all(
      prePromiseLineUps.map(async (lineup) => {
        return await getLikes(lineup, null);
      })
    );
    res.status(200).json(lineupLikes);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Filter lineups by popularity
// @route   GET lineup/popularity
// @access  Public
router.get("/popularity", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  try {
    const lineups = await LineUp.find({}).populate("author");
    const prePromiseLineUps = JSON.parse(JSON.stringify(lineups));
    const lineupLikes = await Promise.all(
      prePromiseLineUps.map(async (lineup) => {
        return await getLikes(lineup, user);
      })
    );
    const popularLineups = lineupLikes.sort(
      (a, b) => b.numberOfLikes - a.numberOfLikes
    );
    res.status(200).json(popularLineups);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Get rankig
// @route   GET /lineup/ranking
// @access  Public
router.get("/ranking", async (req, res, next) => {
  try {
    const lineups = await LineUp.aggregate([
      { $group: { _id: "$author", numLineUps: { $sum: 1 } } },
      { $sort: { numLineUps: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          numLineUps: 1,
          username: "$user.username",
          image: "$user.image",
        },
      },
    ]);
    res.status(200).json(lineups);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Get one line-ups
// @route   GET /lineup/:lineupId
// @access  Private
router.get("/:lineupId", isAuthenticated, async (req, res, next) => {
  const user = req.payload ? req.payload : null;
  const { lineupId } = req.params;
  try {
    const lineup = JSON.parse(
      JSON.stringify(await LineUp.findById(lineupId).populate("author"))
    );
    const lineupLike = await getLikes(lineup, user);
    const reviews = await Review.find({ lineupId: lineupId }).populate(
      "userId"
    );
    res.status(200).json({ lineupLike, reviews });
  } catch (error) {
    console.log(error);
  }
});

// @desc    Create one line-ups
// @route   POST /lineup
// @access  Private
router.post("/", isAuthenticated, async (req, res, next) => {
  const { title, agent, map, description, video } = req.body;
  const userId = req.payload._id;
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i;
  if (!regex.test(video)) {
    return res.status(400).json({ message: "Invalid YouTube URL" });
  }
  try {
    const newLineup = await LineUp.create({
      title,
      agent,
      map,
      description,
      video,
      author: userId,
    });
    res.status(201).json(newLineup);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Edit one line-ups
// @route   PUT lineup/:lineupId
// @access  Private
router.put("/:lineupId", isAuthenticated, async (req, res, next) => {
  const { lineupId } = req.params;
  const { title, agent, map, description, video } = req.body;
  const userId = req.payload._id;
  try {
    const lineup = await LineUp.findById(lineupId);
    if (lineup.author.toString() !== req.payload._id) {
      res
        .status(403)
        .json({ message: "You are not allowed to edit this lineup" });
    } else {
      const editedLineup = await LineUp.findByIdAndUpdate(
        lineupId,
        { title, agent, map, description, video, author: userId },
        { new: true }
      );
      res.status(200).json(editedLineup);
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Delete one line-ups
// @route   DELETE lineup/:lineupId
// @access  Private
router.delete("/:lineupId", isAuthenticated, async (req, res, next) => {
  const { lineupId } = req.params;
  const userId = req.payload._id;
  try {
    const lineup = await LineUp.findById(lineupId);
    if (lineup.author.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You are not allowed to delete this lineup" });
    } else {
      const lineup = await LineUp.findById(lineupId);
      const deletedReview = await Review.deleteMany({ lineupId: lineup._id });
      const deletedLike = await Like.deleteMany({ lineupId: lineup._id });
      const deletedLineup = await LineUp.findByIdAndDelete(lineupId);
      res.status(200).json(deletedLineup, deletedLike, deletedReview);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
