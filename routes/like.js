const router = require('express').Router();
const Like = require('../models/Like');
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');

// @desc    Like and dislike one line-ups
// @route   POST /like/:lineupId
// @access  Private
router.post('/:lineupId', isAuthenticated, async (req, res, next) => {
    const { lineupId } = req.params;
    const user = req.payload._id;
    try {
        const like = await Like.find({lineupId: lineupId, userId: user});
        if(!like) {
            await Like.create({lineupId: lineupId, userId: user});
            res.status(200).json(like);
        } else {
            await Like.findOneAndDelete({lineupId: lineupId, userId: user});
            res.status(200).json(like);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;