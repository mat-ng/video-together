import React, { useEffect, useState } from 'react'

import io from 'socket.io-client'

import getYoutubeID from 'get-youtube-id'
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
  const [mute, setMute] = useState(true)
  const [searchbar, setSearchbar] = useState('')
  const [speed, setSpeed] = useState(1)
  const [videoID, setVideoID] = useState('dQw4w9WgXcQ')
  const [videoPlayer, setVideoPlayer] = useState({})

  useEffect(() => {
    socket.on('new-video', arg => {
      console.log(videoPlayer) //figure out why videoPlayer isn't getting updated state 
      let data = JSON.parse(arg) //might have to change this to state
      console.log(data)

      if (data.mute !== undefined) {
        if(data.mute) videoPlayer.mute()
        else videoPlayer.unMute()
        setMute(data.mute)
      }

      if (data.time !== undefined) {
        videoPlayer.seekTo(data.time)
      }
  
      if (data.searchbar !== undefined) {
        setSearchbar(data.searchbar)
      }

      if (data.speed !== undefined) {
        setSpeed(data.speed)
        videoPlayer.setPlaybackRate(e.target.value)
      }
  
      if (data.videoID !== undefined) {
        setVideoID(data.videoID)
      }
    })

  }, [])


  const renderSearchbar = () => {
    const handleInput = e => {
      setSearchbar(e.target.value) //SCRAP IN PRODUCTION
      
      socket.emit('video', JSON.stringify({ searchbar: e.target.value }))
    }

    const handleSubmit = e => {
      if(getYoutubeID(searchbar)) {
        setVideoID(getYoutubeID(searchbar)) //SCRAP IN PRODUCTION
        
        socket.emit('video', JSON.stringify({ videoID: getYoutubeID(searchbar) }))
      }
    }

    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 640}}>
          <h1 style={{fontFamily: 'Trebuchet MS', fontSize: 23}}>Paste your Youtube URL below and enjoy your watch party!</h1>
          <TextField onChange={handleInput} placeholder='Paste YouTube Link' variant='outlined' value={searchbar} style={{width: 550}}/>
          <Button onClick={handleSubmit} variant='outlined' style={{float: 'right', height: 56}}>Enter</Button>
        </div>
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
        mute: 1,
        playlist: videoID
      }
    }

    const storeEvent = e => {
      console.log('event stored')
      console.log(e.target)
      setVideoPlayer(e.target)
    }

    return (
      <div style={{ pointerEvents: 'none', width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20}} >
        <YouTube 
          videoId={videoID}
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
      videoPlayer.seekTo(videoPlayer.getCurrentTime() + 5) //SCRAP IN PRODUCTION
      
      socket.emit('video', JSON.stringify({ time: videoPlayer.getCurrentTime() + 5 }))
    }
  
    const handleMute = () => {
      mute ? videoPlayer.unMute() : videoPlayer.mute() //SCRAP IN PRODUCTION
      setMute(!mute) //SCRAP IN PRODUCTION

      socket.emit('video', JSON.stringify({ mute: !mute }))
    }

    const handleFastRewind = () => {
      videoPlayer.seekTo(videoPlayer.getCurrentTime() - 5) //SCRAP IN PRODUCTION
      
      socket.emit('video', JSON.stringify({ time: videoPlayer.getCurrentTime() - 5 }))
    }
  
    const handleSpeedChange = e => {
      videoPlayer.setPlaybackRate(e.target.value) //SCRAP IN PRODUCTION
      setSpeed(e.target.value) //SCRAP IN PRODUCTION

      socket.emit('video', JSON.stringify({ speed: e.target.value }))
    }

    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 640}}>
          <Button onClick={handleFastRewind} style={{height: 50}}><FastRewindIcon/></Button>
          <Button onClick={handleFastForward} style={{height: 50}}><FastForwardIcon/></Button>
          <Button onClick={handleMute} style={{height: 50}}>{mute ? <VolumeOffIcon/> : <VolumeUpIcon/>}</Button>
          <Select value={speed} onChange={handleSpeedChange} style={{float: 'right', height: 50}}>
            { speedOptions.map (speedOption => createMenuItem(speedOption)) }
          </Select>
        </div>
      </div>
    )
  }


  return(
    <div>
      {renderSearchbar()}
      {renderVideoPlayer()}
      {renderVideoControls()}
    </div>
  )
  
}

export default Video
