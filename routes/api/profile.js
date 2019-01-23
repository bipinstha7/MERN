const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

/**
 * @route   GET api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {}

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				errors.noprofile = 'There is no profie for this user'
				if (!profile) return res.status(404).json(errors)
				res.status(200).json(profile)
			})
			.catch(err => res.status(500).json(err))
	}
)

module.exports = router
