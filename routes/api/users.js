const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../../models/User')

/**
 * @route   GET api/users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				return res.status(400).json({ email: 'Email already exists' })
			}

			const avatar = gravatar.url(req.body.email, {
				s: '200', // size
				r: 'pg', // rating
				d: 'mm', // default
			})

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					if (err) throw err

					const newUser = {
						name: req.body.name,
						email: req.body.email,
						avatar: avatar,
						password: hash,
					}

					console.log('newUser', newUser)

					User.create(newUser)
						.then(user => res.status(200).json(user))
						.catch(err => res.status(500).json({ err }))
				})
			})
		})
		.catch(err => res.status(500).json({ err: err.message }))
})



module.exports = router
