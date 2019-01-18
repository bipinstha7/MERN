const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

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

/* Middlewares */
app.use(express.json())
app.use(passport.initialize())

/* Passport Config */
require('./config/passport')(passport)

/* require routes */
require('./routes')(app)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`)
})
