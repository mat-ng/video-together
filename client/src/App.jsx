import React from 'react'

import Banner from './assets/Banner.png'
import Video from './components/Video.jsx'


const App = () => {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 30}}>
                <img src={Banner} style={{height: 60}}/>
            </div>
            <Video/>
        </div>
    )
}

export default App
