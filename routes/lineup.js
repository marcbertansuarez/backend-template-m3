const router = require('express').Router();
const LineUp = require('../models/LineUp');
const Review = require('../models/Review');
const jwt = require("jsonwebtoken");
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');


// @desc    Get all line-ups
// @route   GET /lineup
// @access  Public
router.get('/', async (req, res, next) => {;
    try {
        const lineups = await LineUp.find({}).populate('author');
        res.status(200).json(lineups);
    } catch (error) {
        console.log(error);
    }
});

// @desc    Get one line-ups
// @route   GET /lineup/:lineupId
// @access  Public
router.get('/:lineupId', async (req, res, next) => {
    const { lineupId } = req.params;
    try {
        const lineup = await LineUp.findById(lineupId)
        .populate('author')
        .populate('reviews');
        res.status(200).json(lineup);
    } catch (error) {
        console.log(error);
    }
});

// @desc    Create one line-ups
// @route   POST /lineup/
// @access  Private
router.post('/', isAuthenticated, async (req, res, next) => {
    const { title, agent, map, description, video } = req.body;
    const user = req.payload._id
    try {
        const newLineup = await LineUp.create({ title, agent, map, description, video, author: user });
        res.status(201).json(newLineup);
    } catch (error) {
        console.log(error);
    }
});

// @desc    Edit one line-ups
// @route   PUT /:lineupId
// @access  Private
router.put('/:lineupId', isAuthenticated, async (req, res, next) => {
    const { lineupId } = req.params;
    const { title, agent, map, description, video } = req.body;
    try {
        const lineup = await LineUp.findById(lineupId);
        if(lineup.author._id.toString() !== req.payload._id) {
            res.status(403).json({message: 'You are not allowed to edit this lineup'})
        } else {
        const editedLineup = await LineUp.findByIdAndUpdate(lineupId, { title, agent, map, description, video }, { new: true });
        res.status(200).json(editedLineup);
        }
    } catch (error) {
        console.log(error);
    }
})

// @desc    Delete one line-ups
// @route   DELETE /:lineupId
// @access  Private
router.delete('/:lineupId', isAuthenticated, async (req, res, next) => {
    const { lineupId } = req.params;
    try {
        const lineup = await LineUp.findById(lineupId);
        if(lineup.author.toString() !== req.payload._id) {
            res.status(403).json({message: 'You are not allowed to delete this lineup'})
        } else {
        const deletedLineup = await LineUp.findByIdAndDelete(lineupId);
        res.status(200).json(deletedLineup);
        }
    } catch (error) {
        console.log(error);
    }
});

// @desc    Create review to a specific lineup
// @route   POST /:lineupId/review
// @access  Private
router.post('/:lineupId/review', isAuthenticated, async (req, res, next) => {
    const { lineupId } = req.params;
    const user = req.payload._id;
    const { content } = req.body;
    try {
        const newReview = await Review.create({content, lineupId: lineupId, userId: user});
        await LineUp.findByIdAndUpdate(lineupId, {$push: {reviews: newReview} });
        res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;