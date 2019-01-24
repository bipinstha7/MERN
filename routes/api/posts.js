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
		.sort({ date: -1 })
		.then(posts => res.status(200).json(posts))
		.catch(err => res.status(500).json(err))
})

/**
 * @route   GET api/posts/:id
 * @desc    Get post by id
 * @access  Public
 */
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.status(200).json(post))
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res.status(404).json('Post not found for this id')
			}

			res.status(500).json(err)
		})
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

/**
 * @route   DELETE api/posts/:id
 * @desc    Delete post
 * @access  Pivate
 */

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			/* check post owenership */
			if (post.user.toString() !== req.user.id) {
				return res.status(401).json({ notauthorized: 'User not authorized' })
			}

			post.remove()
				.then(() => res.status(200).json({ success: true }))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ notfound: 'Post not found' })
			}

			res.status(500).json({ err: err.message })
		})
})



module.exports = router
