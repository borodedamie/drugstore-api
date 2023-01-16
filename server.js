const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

// Express Initializations
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', require('./routes/userRoutes'))

app.listen(port, () => {
  console.log(`drugstore app listening on port ${port}`)
})