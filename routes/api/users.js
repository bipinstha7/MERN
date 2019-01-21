const express = require('express')
const router = express.Router()

/**
 * @route   GET api/users/test
 * @desc    Test post route
 * @access  Public
 */
router.get('/test', (req, res) => {
	res.json({ message: 'user message' })
})

module.exports = router
