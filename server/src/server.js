const path = require('path')

const express = require('express')
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../../.env') })
const socketIO = require('socket.io')

const NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 3001


const app = express()
	.use(express.static(path.resolve(__dirname, '../../client/dist')))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(app)
	.on('connection', socket => {
		socket.on('clicks', (data) => {
			io.emit('new-clicks', data)
		})

		console.log('Client connected')

		socket.on('disconnect', () => {
			console.log('Client disconnected')
		})
	})
