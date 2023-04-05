const router = require('express').Router();
const LineUp = require('../models/LineUp');
const User = require('../models/User');
const Like = require('../models/Like');
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');
const getLikes = require('../utils/likesHelper');

// @desc    Profile user
// @route   GET /profile
// @access  Private
router.get('/', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    try {
        const userDB = await User.findById(userId);
        const lineUps = await LineUp.find({author: userId});
        const prePromiseLineUps = JSON.parse(JSON.stringify(lineUps));
        const lineupLikes = await Promise.all(prePromiseLineUps.map(async (lineup) => {
            return await getLikes(lineup, userDB);
        }))
        res.status(200).json({
            user: {
                username: userDB.username,
                image: userDB.image
            },
            lineupLikes
        })
    } catch (error) {
        console.log(error)
    }
});

// @desc    Profile user
// @route   GET /profile
// @access  Private
router.put('/edit', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    const { username, image } = req.body; 
    try {
        const userDB = await User.findById(userId);
        if(userDB._id.toString() !== userId) {
            res.status(403).json({message: 'You are not allowed to edit this profile'});
        } else {
            const updatedUser = await User.findByIdAndUpdate(userId, { username, image }, { new: true })
            res.status(200).json(updatedUser)
        } 
    } catch (error) {
        console.log(error)
    }
});

router.get('/liked', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    try {
        const userDB = await User.findById(userId);
        const liked = await Like.find({userId: userId}).populate('lineupId');
        const prePromiseLikes = JSON.parse(JSON.stringify(liked));
        const likedLineUps = await Promise.all(prePromiseLikes.map(async (lineup) => {
            return await getLikes(lineup.lineupId, userDB);
        }))
        res.status(200).json({
            user: {
                username: userDB.username,
                image: userDB.image
            },
            likedLineUps
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;