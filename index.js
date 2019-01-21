const express = require('express')
const mongoose = require('mongoose')

const app = express()

/* DB Congif */
const db = require('./config/keys').mongoURI

/* Connect to MongoDB */
mongoose
	.connect(
		db,
		{ useNewUrlParser: true }
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log({ Error: err }))

/* require routes */
require('./routes')(app)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`)
})
