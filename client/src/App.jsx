import React from 'react'

import Banner from './assets/Banner.png'
import IsMobileBrowser from './components/IsMobileBrowser.jsx'
import Video from './components/Video.jsx'


const App = () => {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20, paddingBottom: 25}}>
                <img src={Banner} style={{height: 60}}/>
            </div>
            
            { IsMobileBrowser() ? 
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
                    <h1 style={{fontFamily: 'Trebuchet MS', fontSize: 22, marginLeft: 10, marginRight: 10, textAlign: 'center'}}>Sorry, this app is not supported on mobile or small screens.</h1>
                </div>
                : 
                <Video/> 
            }
        </div>
    )
}

export default App
