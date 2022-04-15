import React from 'react'

import Title from './components/images/Title.png'
import Video from './components/Video.jsx'


const App = () => {

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 30}}>
                <img src={Title} style={{height: 60}}/>
            </div>
            <Video/>
        </div>
    )
}

export default App
