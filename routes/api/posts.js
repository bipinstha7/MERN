const express = require('express')
const router = express.Router()
const passport = require('passport')

const Post = require('../../models/Post')

/**
 * @route   POST api/posts
 * @desc    Create post
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { text, name, avatar } = req.body
	const post = {
		text,
		name,
		avatar,
		user: req.user.id
	}

	Post.create(post)
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500).json(err))
})

module.exports = router
