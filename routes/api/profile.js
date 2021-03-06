const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

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
 * @route   GET api/profile/all
 * @desc    Get all profile
 * @access  Public
 */
router.get('/all', (req, res) => {
	const errors = {}

	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles.length) {
				errors.noprofiles = 'There are no profiles'
				return res.status(404).json(errors)
			}

			res.status(200).json(profiles)
		})
		.catch(err => {
			res.status(500).json(err)
		})
})

/**
 * @route   GET api/profile/handle/:handle
 * @desc    Get profile by handle
 * @access  Public
 */
router.get('/handle/:handle', (req, res) => {
	const errors = {}

	Profile.findOne({ handle: req.params.handle })
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
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user ID
 * @access  Public
 */
router.get('/user/:user_id', (req, res) => {
	const errors = {}

	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			res.status(200).json(profile)
		})
		.catch(err => {
			if (err.kind && err.kind === 'ObjectId') {
				errors.noprofile = 'There is no profile for this user'
				res.status(404).json(errors)
			}

			res.status(500).json(err)
		})
})

/**
 * @route   POST api/profile
 * @desc    Create or Update user profile
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body)

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

	Profile.findOne({ user: req.user.id })
		.then(profile => {
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
		.catch(err => res.status(500).json(err))
})

/**
 * @route   GET api/profile/experience
 * @desc    Add experience to profile
 * @access  Private
 */
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateExperienceInput(req.body)

	// check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			const { title, company, location, from, to, current, description } = req.body
			const newExperience = {
				title,
				company,
				location,
				from,
				to,
				current,
				description
			}

			// Add to experience array - in the begining of an array
			profile.experience.unshift(newExperience)

			profile
				.save()
				.then(profile => res.status(200).json(profile))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => res.status(500).json(err))
})

/**
 * @route   GET api/profile/education
 * @desc    Add educaton to profile
 * @access  Private
 */
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateEducationInput(req.body)

	// check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			const { school, degree, fieldofstudy, from, to, current, description } = req.body
			const newEducation = {
				school,
				degree,
				fieldofstudy,
				from,
				to,
				current,
				description
			}

			// Add to experience array - in the begining of an array
			profile.education.unshift(newEducation)

			profile
				.save()
				.then(profile => res.status(200).json(profile))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => res.status(500).json(err))
})

/**
 * @route   DELETE api/profile/experience/:exp_id
 * @desc    Delete experience from profile
 * @access  Private
 */
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {}
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			// Get remove index
			const removeIndex = profile.experience
				.map(experience => experience._id.toString())
				.indexOf(req.params.exp_id)

			if (removeIndex === -1) {
				errors.expError = 'Data has already been deleted or can not be deleted'
				return res.status(500).json(errors)
			}

			// Splice out of array
			profile.experience.splice(removeIndex, 1)

			profile
				.save()
				.then(profile => res.status(200).json(profile))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => res.status(500).json(err))
})

/**
 * @route   DELETE api/profile/education/:edu_id
 * @desc    Delete education from profile
 * @access  Private
 */
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {}
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}

			// Get remove index
			const removeIndex = profile.education
				.map(education => education._id.toString())
				.indexOf(req.params.edu_id)

			if (removeIndex === -1) {
				errors.expError = 'Data has already been deleted or can not be deleted'
				return res.status(500).json(errors)
			}

			// Splice out of array
			profile.education.splice(removeIndex, 1)

			profile
				.save()
				.then(profile => res.status(200).json(profile))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => res.status(500).json(err))
})

/**
 * @route   DELETE api/profile
 * @desc    Delete user and profile
 * @access  Private
 */
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndRemove({ user: req.user.id })
		.then(() => {
			User.findOneAndRemove({ _id: req.user.id })
				.then(() => res.status(200).json({ success: true }))
				.catch(err => res.status(500).json(err))
		})
		.catch(err => res.status(500).json(err))
})

module.exports = router
