import React, { useEffect, useState } from 'react'

import io from 'socket.io-client'
import YouTube from 'react-youtube'

import getYoutubeID from 'get-youtube-id'

const socket = io()

const Video = () => {
  const [searchbar, setSearchbar] = useState('')
  const [videoID, setVideoID] = useState('2g811Eo7K8U')
  
  const videoOptions = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
      disablekb: 1
    }
  }

  const renderSearchbar = () => {
    const handleInput = e => {
      setSearchbar(e.target.value)

      socket.emit('video', JSON.stringify({ searchbar: e.target.value }))
    }

    const handleSubmit = () => {
      if(getYoutubeID(searchbar)) {
        // setVideoID(getYoutubeID(searchbar)) //SCRAP IN PRODUCTION

        socket.emit('video', JSON.stringify({ videoID: getYoutubeID(searchbar) }))
      }
    }

    return(
      <div>
        <input onChange={handleInput} placeholder='Paste YouTube Link' value={searchbar} />
        <button onClick={handleSubmit}>Enter</button>
      </div>
    )
  }

  let videoPlayer
  const storeEvent = e => {
    videoPlayer = e.target
  }

  useEffect(() => {
    socket.on('new-video', arg => {
      let data = JSON.parse(arg)
      console.log(data)
  
      if (data.play !== undefined) {
        data.play ? videoPlayer.playVideo() : videoPlayer.pauseVideo()
      }
  
      if (data.searchbar !== undefined) {
        setSearchbar(data.searchbar)
      }
  
      if(data.videoID !== undefined) {
        setVideoID(data.videoID)
      }
    })

  }, [])

  

  // const handlePlay = e => {
  //   setPause(false)
  //   // console.log(e.target.getCurrentTime())
  // }

  // const handleTimeChange = e => {
  //   console.log(e)
  //   console.log(e)
  //   if(e.data !== 3) return
    
  //   console.log(e.target.getCurrentTime())

  //   console.log(e.target.playVideo())
  //   e.target.playVideo()
  //   e.target.seekTo(10)
  // }

  const handlePlay = e => {
    socket.emit('video', JSON.stringify({ play: true }))
  }

  const handlePause = e => {
    socket.emit('video', JSON.stringify({ play: false }))
  }

  const handleError = e => {
    console.log(e)
  }

  return(
    <div>
      {renderSearchbar()}
      <YouTube 
        id='videoPlayer'
        videoId={videoID}
        opts={videoOptions}
        onReady={storeEvent}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
      />
    </div>
  )
  
}

export default Video
