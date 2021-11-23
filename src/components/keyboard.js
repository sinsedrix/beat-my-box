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

    const computeOscTable = useCallback(() => {
        Object.keys(oscTable).forEach(osck => oscTable[osck] && oscTable[osck].stop())
        let table = keys.reduce((o, octk) => ({ ...o, ...octk.reduce((a, key) => ({ ...a, [key.id]: sound.createOscillator(audioCtx, gain, key.freq, wave ) }), {}) }), {})
        setOscTable(table)
    }, [keys, gain])

    useEffect(computeOscTable, [keys, wave])

    const onKeyPressed = (evt) => {
        let kid = evt.target.id
        if(!oscTable[kid].started) {
            oscTable[kid].started = true
            oscTable[kid].start()
        }
    }

    const onKeyReleased = (evt) => {
        let kid = evt.target.id
        if(oscTable[kid].started) {
            oscTable[kid].stop()
            oscTable[kid].started = false
        }   
    }

    return (
        <div id="keyboard">
            <div className="keys">
                {keys.map(octkeys => 
                    
                    <div className="octave">
                    {octkeys.map(key =>
                        <div className="key" id={key.id} onMouseDown={onKeyPressed} onMouseUp={onKeyReleased}>
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