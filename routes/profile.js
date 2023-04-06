const router = require('express').Router();
const LineUp = require('../models/LineUp');
const User = require('../models/User');
const Like = require('../models/Like');
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');
const getLikes = require('../utils/likesHelper');
const fileUploader = require('../config/cloudinary.config');
const cloudinary = require('cloudinary');

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
router.put('/edit', isAuthenticated, fileUploader.single('image') ,async (req, res, next) => {
    const user = req.payload;
    const { username } = req.body; 
    if(req.file) {
        image = req.file.path;
    } else {
        image = cloudinary.url(user.picture)
    }
    try {
        const userDB = await User.findById(user._id);
        if(userDB._id.toString() !== user._id) {
            res.status(403).json({message: 'You are not allowed to edit this profile'});
        } else {
            const updatedUser = await User.findByIdAndUpdate(user._id, { username, image }, { new: true })
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
        const liked = await Like.find({userId: userId})
        .populate({
            path: 'lineupId',
            populate: {path: 'author'}
        });
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
});

router.get('/:userId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.params;
    const user = req.payload;
    try {
        const userDB = await User.findById(userId)
        const lineUps = await LineUp.find({author: userId});
        const prePromiseLineUps = JSON.parse(JSON.stringify(lineUps));
        const lineupLikes = await Promise.all(prePromiseLineUps.map(async (lineup) => {
            return await getLikes(lineup, user);
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
})

module.exports = router;