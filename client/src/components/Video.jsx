import React, { useState } from 'react'

import io from 'socket.io-client'

import getYouTubeId from 'get-youtube-id'
import YouTube from 'react-youtube'

import Button from '@mui/material/Button'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'


const socket = io()

const Video = () => {
  const [joined, setJoined] = useState(false)
  const [mute, setMute] = useState(false)
  const [searchbar, setSearchbar] = useState('')
  const [speed, setSpeed] = useState(1)
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ')
  const [videoIdError, setVideoIdError] = useState(false)
  const [videoPlayer, setVideoPlayer] = useState({})

  
  const renderJoinButton = () => {
    const handleJoin = () => {
      setJoined(true)
    }
    
    return (
      <Button onClick={handleJoin} variant='contained' style={{fontSize: 20}}>Click here to join the video!</Button>
    )
  }


  const renderSearchbar = () => {
    const handleInput = e => {
      // setSearchbar(e.target.value) //SCRAP IN PRODUCTION
      
      socket.emit('video-control', JSON.stringify({ searchbar: e.target.value }))
    }

    const handleSubmit = () => {
      if(getYouTubeId(searchbar)) {
        // setVideoId(getYouTubeId(searchbar)) //SCRAP IN PRODUCTION
      
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

      socket.on('new-video-control', arg => {
        let data = JSON.parse(arg)

        if (data.mute !== undefined) {
          data.mute ? e.target.mute() : e.target.unMute()
          setMute(data.mute)
        }

        if (data.time !== undefined) {
          e.target.seekTo(data.time)
        }
    
        if (data.searchbar !== undefined) {
          setSearchbar(data.searchbar)
        }

        if (data.speed !== undefined) {
          e.target.setPlaybackRate(data.speed)
          setSpeed(data.speed)
        }
    
        if (data.videoId !== undefined) {
          setVideoId(data.videoId)
          socket.off()
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
    const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

    const createMenuItem = (value) => {
      return <MenuItem value={value}>{value}x</MenuItem>
    }

    const handleFastForward = () => {
      // videoPlayer.seekTo(videoPlayer.getCurrentTime() + 5) //SCRAP IN PRODUCTION
      
      socket.emit('video-control', JSON.stringify({ time: videoPlayer.getCurrentTime() + 5 }))
    }
  
    const handleMute = () => {
      // mute ? videoPlayer.unMute() : videoPlayer.mute() //SCRAP IN PRODUCTION
      // setMute(!mute) //SCRAP IN PRODUCTION

      socket.emit('video-control', JSON.stringify({ mute: !mute }))
    }

    const handleFastRewind = () => {
      // videoPlayer.seekTo(videoPlayer.getCurrentTime() - 5) //SCRAP IN PRODUCTION
      
      socket.emit('video-control', JSON.stringify({ time: videoPlayer.getCurrentTime() - 5 }))
    }
  
    const handleSpeedChange = e => {
      // videoPlayer.setPlaybackRate(e.target.value) //SCRAP IN PRODUCTION
      // setSpeed(e.target.value) //SCRAP IN PRODUCTION

      socket.emit('video-control', JSON.stringify({ speed: e.target.value }))
    }

    return (
      <div>
        <Button onClick={handleFastRewind} style={{height: 50}}><FastRewindIcon/></Button>
        <Button onClick={handleFastForward} style={{height: 50}}><FastForwardIcon/></Button>
        <Button onClick={handleMute} style={{height: 50}}>{mute ? <VolumeOffIcon/> : <VolumeUpIcon/>}</Button>
        <Select value={speed} onChange={handleSpeedChange} style={{float: 'right', height: 50}}>
          { speedOptions.map (speedOption => createMenuItem(speedOption)) }
        </Select>
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
