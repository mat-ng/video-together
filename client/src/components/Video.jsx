import React, { useState } from 'react'

import io from 'socket.io-client'
import getYouTubeId from 'get-youtube-id'

import Button from '@mui/material/Button'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import TextField from '@mui/material/TextField'
import YouTube from 'react-youtube'


const socket = io()

const Video = () => {
  const [joined, setJoined] = useState(false)
  const [searchbar, setSearchbar] = useState('')
  const [start, setStart] = useState(0)
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ')
  const [videoIdError, setVideoIdError] = useState(false)
  const [videoPlayer, setVideoPlayer] = useState({})

  socket.once('new-user-info', arg => {
    let data = JSON.parse(arg)

    setSearchbar(data.searchbar)
    setStart(data.start + 1)
    setVideoId(data.videoId),
    setVideoIdError(data.videoIdError)
  })
  

  const renderJoinButton = () => {
    const handleJoin = () => {
      setJoined(true)
      socket.emit('video-control', JSON.stringify({ newUser: true }))
    }
    
    return (
      <Button onClick={handleJoin} variant='contained' style={{fontSize: 20}}>Click here to join the video!</Button>
    )
  }


  const renderSearchbar = () => {
    const handleInput = e => {
      socket.emit('video-control', JSON.stringify({ searchbar: e.target.value }))
    }

    const handleSubmit = () => {
      if(getYouTubeId(searchbar)) {
        socket.emit('video-control', JSON.stringify({ videoId: getYouTubeId(searchbar), videoIdError: false }))
      }
      else {
        socket.emit('video-control', JSON.stringify({ videoIdError: true }))
      }
    }

    return (
      <div>
        <h1 style={{fontFamily: 'Trebuchet MS', fontSize: 22}}>Paste your YouTube URL below and enjoy your watch party!</h1>
        <TextField onChange={handleInput} placeholder='Paste YouTube Link' variant='outlined' value={searchbar} error={videoIdError} helperText={videoIdError ? 'Please enter a valid YouTube URL' : ''} style={{width: 550}}/>
        <Button onClick={handleSubmit} variant='outlined' style={{float: 'right', height: 56}}>Enter</Button>
      </div>
    )
  }


  const renderVideoPlayer = () => {
    const videoOptions = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        loop: 1,
        playlist: videoId
      }
    }

    const storeEvent = e => {
      setVideoPlayer(e.target)
      e.target.seekTo(start)

      socket.off()
      
      socket.on('new-video-control', arg => {
        let data = JSON.parse(arg)

        if(data.newUser !== undefined) {
          socket.emit('user-info', JSON.stringify({
            searchbar: searchbar,
            start: e.target.getCurrentTime() || 0,
            videoId: videoId,
            videoIdError: videoIdError
          }))
        }

        if (data.time !== undefined) {
          e.target.seekTo(data.time)
        }
    
        if (data.searchbar !== undefined) {
          setSearchbar(data.searchbar)
        }
    
        if (data.videoId !== undefined && data.videoId !== videoId) {
          setVideoId(data.videoId)
          setStart(0)
        }

        if (data.videoIdError !== undefined) {
          setVideoIdError(data.videoIdError)
        }
      })
    }

    return (
      <div style={{ pointerEvents: 'none', width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20 }} >
        <YouTube 
          videoId={videoId}
          opts={videoOptions}
          onReady={storeEvent}
        />
      </div>
    )
  }


  const renderVideoControls = () => {
    const handleFastRewind = () => {
      socket.emit('video-control', JSON.stringify({ time: videoPlayer.getCurrentTime() - 5 }))
    }

    const handleFastForward = () => {
      socket.emit('video-control', JSON.stringify({ time: videoPlayer.getCurrentTime() + 5 }))
    }

    return (
      <div>
        <Button onClick={handleFastRewind} style={{height: 50}}><FastRewindIcon/></Button>
        <Button onClick={handleFastForward} style={{height: 50}}><FastForwardIcon/></Button>
      </div>
    )
  }


  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      { joined ?
          <div style={{width: 640}}>
            {renderSearchbar()}
            {renderVideoPlayer()}
            {renderVideoControls()}
          </div>
        :
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 70 }}>
           {renderJoinButton()}
        </div>
      }
    </div>
  )
}

export default Video
