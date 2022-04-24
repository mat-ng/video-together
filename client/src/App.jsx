import React from 'react'

import Banner from './assets/Banner.png'
import IsMobileBrowser from './hooks/IsMobileBrowser.jsx'
import Video from './components/Video.jsx'


const App = () => {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20, paddingBottom: 25}}>
                <img src={Banner} style={{height: 60}}/>
            </div>
            
            { IsMobileBrowser() ? 
                <Video/> 
                : 
                <Video/> 
            }
        </div>
    )
}

export default App
