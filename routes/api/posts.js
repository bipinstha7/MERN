const express = require('express')
const router = express.Router()
const passport = require('passport')

const Post = require('../../models/Post')
const validatePostInput = require('../../validation/post')

/**
 * @route   GET api/posts
 * @desc    Get post
 * @access  Public
 */
router.get('/', (req, res) => {
	Post.find()
		.sort({date: -1})
		.then(posts => res.status(200).json(posts))
		.catch(err => res.status(500).json(err))
})





/**
 * @route   POST api/posts
 * @desc    Create post
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body)

	if (!isValid) return res.status(400).json(errors)

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
