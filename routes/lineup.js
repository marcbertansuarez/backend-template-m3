const router = require('express').Router();
const LineUp = require('../models/LineUp');
const Review = require('../models/Review');
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
        const reviews = await Review.findbyId(lineupId)
        res.status(200).json(lineup, reviews);
    } catch (error) {
        console.log(error);
    }
});

// @desc    Create one line-ups
// @route   POST /lineup
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
// @route   PUT lineup/:lineupId
// @access  Private
router.put('/:lineupId', isAuthenticated, async (req, res, next) => {
    const { lineupId } = req.params;
    const { title, agent, map, description, video } = req.body;
    const user = req.payload._id;
    try {
        const lineup = await LineUp.findById(lineupId);
        if(lineup.author.toString() !== req.payload._id) {
            res.status(403).json({message: 'You are not allowed to edit this lineup'})
        } else {
        const editedLineup = await LineUp.findByIdAndUpdate(lineupId, { title, agent, map, description, video, author: user }, { new: true });
        res.status(200).json(editedLineup);
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;