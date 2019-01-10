const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const router = express.Router()

const User = require('../../models/User')
const keys = require('../../config/keys')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

/**
 * @route   GET api/users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body)

	if (!isValid) {
		return res.status(400).json(errors)
	}

	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				errors.Email = 'Email already exists'
				return res.status(400).json(errors)
			}

			const avatar = gravatar.url(req.body.email, {
				s: '200', // size
				r: 'pg', // rating
				d: 'mm' // default
			})

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					if (err) throw err

					const newUser = {
						name: req.body.name,
						email: req.body.email,
						avatar: avatar,
						password: hash
					}

					console.log('newUser', newUser)

					User.create(newUser)
						.then(user => res.status(200).json(user))
						.catch(err => res.status(500).json({ err }))
				})
			})
		})
		.catch(err => res.status(500).json(err.message))
})

/**
 * @route   GET api/users/login
 * @desc    Login user / Returning JWT Token
 * @access  Public
 */
router.post('/login', (req, res) => {
	const { email, password } = req.body
	const { errors, isValid } = validateLoginInput(req.body)

	if (!isValid) {
		return res.status(400).json({ err: errors })
	}

	User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = 'Email / Password incorrect'
				return res.status(400).json(errors)
			}

			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					const payload = {
						id: user.id,
						name: user.name,
						avatar: user.avatar
					}

					jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
						res.status(200).json({
							success: true,
							token: `Bearer ${token}`
						})
					})
				} else {
					errors.password = 'Email / Password incorrect'
					res.status(400).json(errors)
				}
			})
		})
		.catch(err => res.status(500).json({ err }))
})

module.exports = router
