require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//db connection
mongoose.connect(process.env.DATABASE_URL,
    {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true}
)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const usersRouter = require('./routes/users')
const tamanRouter = require('./routes/taman')

app.use('/users', usersRouter)
app.use('/taman', tamanRouter)
app.listen(3000, () => console.log('server started'))

