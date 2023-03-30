const router = require('express').Router();
const LineUp = require('../models/LineUp');
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');
const getLikes = require('../utils/likesHelper');

// @desc    Profile user
// @route   GET /profile
// @access  Private
router.get('/', isAuthenticated, async (req, res, next) => {
    const user = req.payload._id;
    try {
        const userDB = await User.findById(user);
        const lineUps = await LineUp.find({author: user});
        const lineupLikes = await Promise.all(lineUps.map(lineup => {
            return getLikes(lineup, userDB);
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
    const user = req.payload._id;
    const { username, image } = req.body; 
    try {
        const userDB = await User.findById(user);
        if(userDB._id.toString() !== user) {
            res.status(403).json({message: 'You are not allowed to edit this profile'});
        } else {
            const updatedUser = await User.findByIdAndUpdate(user, { username, image }, { new: true })
            res.status(200).json(updatedUser)
        } 
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;