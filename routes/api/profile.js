const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const validateProfileInput = require('../../validation/profile')

/**
 * @route   GET api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {}

	Profile.findOne({ user: req.user.id })
	.populate('user', ['name', 'avatar'])
		.then(profile => {
			errors.noprofile = 'There is no profie for this user'
			if (!profile) return res.status(404).json(errors)
			res.status(200).json(profile)
		})
		.catch(err => res.status(500).json(err))
})

/**
 * @route   GET api/profile/handle/:handle
 * @desc    Get profile by handle
 * @access  Public
 */
router.get('/handle/:handle', (req, res) => {
	const errors = {}

	Profile.findOne({handle: req.params.handle})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			res.status(200).json(profile)
		})
		.catch(err => res.status(500).json(err))
})



/**
 * @route   POST api/profile
 * @desc    Create or Update user profile
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const {errors, isValid} = validateProfileInput(req.body)

	// check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	const profileFields = {}
	profileFields.user = req.user.id

	if (req.body.handle) profileFields.handle = req.body.handle
	if (req.body.company) profileFields.company = req.body.company
	if (req.body.website) profileFields.website = req.body.website
	if (req.body.location) profileFields.location = req.body.location
	if (req.body.bio) profileFields.bio = req.body.bio
	if (req.body.status) profileFields.status = req.body.status
	if (req.body.githubusername) profileFields.githubusername = req.body.githubusername

	// Skills - Split into array
	if (typeof req.body.skills !== undefined) {
		profileFields.skills = req.body.skills.split(',')
	}

	// Social Links
	profileFields.social = {}
	if (req.body.youtube) profileFields.social.youtube = req.body.youtube
	if (req.body.twitter) profileFields.social.twitter = req.body.twitter
	if (req.body.facebook) profileFields.social.facebook = req.body.facebook
	if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
	if (req.body.instagram) profileFields.social.instagram = req.body.instagram

	Profile.findOne({ user: req.user.id }).then(profile => {
		if (profile) {
			// Update
			Profile.findOneAndUpdate({ user: req.user.id }, profileFields, { new: true })
				.then(profile => res.status(200).json(profile))
				.catch(err => res.status(500).json(err))
		} else {
			// Create

			// Checkif handle exists
			Profile.findOne({ handle: profileFields.handle })
				.then(profile => {
					if (profile) {
						errors.handle = 'That handle already exists'
						return res.status(400).json(errors)
					}

					Profile.create(profileFields)
						.then(profile => res.status(200).json(profile))
						.catch(err => res.status(500).json)
				})
				.catch(err => res.status(500).json(err))
		}
	})
})

module.exports = router
