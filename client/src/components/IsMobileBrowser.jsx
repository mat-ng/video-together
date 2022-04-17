import { useEffect, useState } from 'react'

const IsMobileBrowser = () => {
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, []);

    return (width > height ? width < 1190 : height < 1190)
}

export default IsMobileBrowser
