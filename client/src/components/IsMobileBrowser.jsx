import { useEffect, useState } from 'react'

const IsMobileBrowser = () => {
    const [width, setWidth] = useState(window.innerWidth)

    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, []);

    return (width <= 768)
}

export default IsMobileBrowser