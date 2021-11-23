import React, { createRef, useRef, useState } from "react"

const Player = ({keys, parts, time, setTime }) => {
    const [playing, setPlaying] = useState(false)

    const handlePlayPause = (evt) => {
        setPlaying(!playing)
    } 

    
    const handleBack = (evt) => {
        setTime(0)
    } 

    return (
        <div id="player">
            <button className={playing ? "pause":"play"} onClick={handlePlayPause}><label className="icon"></label></button>
            <button className="back" onClick={handleBack}><label className="icon"></label></button>
        </div>
    )
}

export default Player