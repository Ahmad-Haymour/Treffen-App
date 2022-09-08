require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const app = express()

const {PORT, DB_URL, DB_PORT, DB_NAME} = process.env

mongoose.connect(`mongodb://${DB_URL}:27017/treffen-app`)

app.use(express.json())
app.use(cookieParser())

app.use('/user', require('./routes/user'))
app.use('/event', require('./routes/events-list') )

app.post('/drop-database', async(req, res, next)=>{
    await mongoose.connection.db.dropDatabase()
    res.status(200).send('Database dropped successfully')
})

app.use( (req, res, next)=>{
    const error = new Error('Falsche URL!')
    error.status = 404
    return next(error)
})

app.use( (error, req, res, next)=>{

    res.status(error.status || 500).send({
        error: error.message
    })
})

app.listen(4000, ()=> console.log('Server running on port: ', 4000))