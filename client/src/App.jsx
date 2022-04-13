import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'


const App = () => {

    useEffect(() => {
        let socket = io()
    }, [])

    return (
        <p>Hello World</p>
    )
}

export default App
