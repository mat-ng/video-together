const path = require('path')

const express = require('express')
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../../.env')})
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3001


const app = express()
	.use(express.static(path.resolve(__dirname, '../../client/dist')))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(app)
	.on('connection', socket => {
		// When new connection, tell frontend to getCurrentTime(), 
		// then send back to backend, then send to frontend and make sure 
		// everyone is at the same time

		console.log('Client connected')

		socket.on('video-control', data => {
			io.emit('new-video-control', data)
			console.log(data)

		})

		socket.on('disconnect', () => {
			console.log('Client disconnected')
		})
	})
