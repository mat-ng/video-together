import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'


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
                Click here
            </button>
        </div>
    )
}

export default App
