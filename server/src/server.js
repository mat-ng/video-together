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
		
		socket.on('video-control', data => {
			io.emit('new-video-control', data)
		})

		socket.on('user-info', data => {
			io.emit('new-user-info', data)
		})
	})
