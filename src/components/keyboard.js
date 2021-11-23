import React, { useCallback, useEffect, useState } from "react"
import * as sound from "../sound"

const Keyboard = ({ keys, volume, wave }) => {
    const [audioCtx, setAudioCtx] = useState(sound.createAudioContext())
    const [oscTable, setOscTable] = useState({})
    const [gain, setGain] = useState({})

    const computeCtx = useCallback(() => {
        setGain(sound.createGain(audioCtx, volume))
    }, [volume])

    useEffect(computeCtx, [volume])

    const cleanOscTable = useCallback(() => {
        Object.keys(oscTable).forEach(osck => oscTable[osck] && oscTable[osck].stop())
    }, [keys, gain])

    useEffect(cleanOscTable, [keys, wave])

    const onKeyPressed = (evt) => {
        let kid = evt.target.id
        if(!oscTable[kid]) {
            let key = keys.reduce((a, oki) =>  a || oki.find(ki => ki.id === kid), null)
            let osc = sound.createOscillator(audioCtx, gain, key.freq, wave )
            setOscTable({ ...oscTable, [kid]: osc})
            osc.start()
        }
    }

    const onKeyReleased = (evt) => {
        let kid = evt.target.id
        if(oscTable[kid]) {
            oscTable[kid].stop()
            delete oscTable[kid]
        }   
    }

    return (
        <div id="keyboard">
            <div className="keys">
                {keys.map((octkeys, o) => 
                    
                    <div className="octave" key={'o'+o}>
                    {octkeys.map(key =>
                        <div className="key" key={key.id} id={key.id} onMouseDown={onKeyPressed} onMouseUp={onKeyReleased}>
                            <div>{key.name}<sub>{key.oct}</sub></div>
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Keyboard