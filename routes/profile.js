const router = require('express').Router();
const LineUp = require('../models/LineUp');
const Review = require('../models/Review');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');

// @desc    Profile user
// @route   GET /profile
// @access  Private
router.get('/', isAuthenticated, async (req, res, next) => {
    const user = req.payload._id;
    try {
        const userDB = await User.findById(user);
        const lineUps = await LineUp.find({author: user});
        res.status(200).json({
            user: {
                username: userDB.username,
                image: userDB.image
            },
            lineUps
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