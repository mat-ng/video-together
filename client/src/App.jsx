import React, { useState } from 'react'
import io from 'socket.io-client'

import Title from './components/images/Title.png'
import Video from './components/Video.jsx'

const socket = io()

const App = () => {
    const [clicks, setClicks] = useState(0)

    socket.on('new-clicks', arg => {
        setClicks(arg)
    })

    return (
        <div>
            {/* <p>{clicks}</p>
            <button 
                onClick={() => {
                    setClicks(clicks + 1)
                    socket.emit('clicks', clicks + 1)
                }}>
                Click Here
            </button> */}
            <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 30}}>
                <img src={Title} style={{height: 60}}/>
            </div>
            <Video/>
        </div>
    )
}

export default App
