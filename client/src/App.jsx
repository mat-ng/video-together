import React, { useState } from 'react'
import io from 'socket.io-client'

import Video from './components/Video.jsx'

const socket = io()

const App = () => {
    const [clicks, setClicks] = useState(0)

    socket.on('new-clicks', arg => {
        setClicks(arg)
    })

    return (
        <div>
            <p>{clicks}</p>
            <button 
                onClick={() => {
                    setClicks(clicks + 1)
                    socket.emit('clicks', clicks + 1)
                }}>
                Click Here
            </button>
            <Video/>
        </div>
    )
}

export default App
