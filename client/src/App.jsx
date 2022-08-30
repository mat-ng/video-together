import React from 'react'

import SiteBanner from './assets/SiteBanner.png'
import IsMobileBrowser from './hooks/IsMobileBrowser.jsx'
import Video from './components/Video.jsx'


const App = () => {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20, paddingBottom: 25}}>
                <img src={SiteBanner} style={{height: 60}}/>
            </div>
            
            { IsMobileBrowser() ? 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1 style={{fontFamily: 'Trebuchet MS', fontSize: 22, marginLeft: 10, marginRight: 10, textAlign: 'center'}}>Sorry, this app is not supported on mobile or small screens.<br/><br/>If you are on a laptop/computer, please try zooming out.</h1>
                </div>
                : 
                <Video/> 
            }
        </div>
    )
}

export default App
