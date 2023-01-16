const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`drugstore app listening on port ${port}`)
})