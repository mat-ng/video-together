const path = require('path')

const express = require('express')
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../../.env') })

const NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 3001

const app = express()


if (NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../client/dist')))
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
