require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const port = process.env.PORT || 3000
const mongooseOptions = require('./config/mongoose')
const cron = require('./config/cron')
// const auth = require('./config/auth')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

// mongoose.connect(process.env.DATABASE_URL, mongooseOptions).catch(err=>console.log(`MongoDB Error: ${err.message}`))

const client = require('./config/discord')

app.use(express.static('public'))
const api = require('./api')
app.use('/api', api)

// cron.JobPrice.start() // Starts desired cronjob
// cron.JobLiquidity.start() // Starts desired cronjob

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

client.login(process.env.BOT_TOKEN)

