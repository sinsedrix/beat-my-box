import React, { useEffect, useState, useCallback } from "react"
import * as sound from "../sound"

const Player = ({ keys, parts, time, setTime, volume, nbNotes, tempo, wave }) => {
    const [audioCtx, setAudioCtx] = useState(sound.createAudioContext())
    const [playing, setPlaying] = useState(false)
    const [timerId, setTimerId] = useState(null)
    const beepLength = 1

    useEffect(() => {
        if(playing) run()
        else window.clearTimeout(timerId)
    }, [playing])

    useEffect(() => {
        if(playing) playNotes(time)
    }, [time])

    const run = () => {
        const secondsPerBeat = 60.0 / tempo / 4
        
        setTime(prev => (prev+1)%nbNotes)
        
        if(playing)
            setTimerId(window.setTimeout(run, secondsPerBeat*1000))
    }

    const playNotes = (t) => {    
        const noteTime = audioCtx.currentTime  
        for(let kid in parts) {
            let part = parts[kid]
            if(part[t]) {
                let key = keys.reduce((a, octkeys) => a || octkeys.find(octk => octk.id === kid), null)
                playNote(noteTime, key.freq)
            }
        }
    }
    
    const playNote = (noteTime, freq) => {
        const sweepEnv = audioCtx.createGain()
        //sweepEnv.gain.cancelScheduledValues(noteTime)
        //sweepEnv.gain.setValueAtTime(0, noteTime)
        sweepEnv.gain.linearRampToValueAtTime(volume, noteTime + 0.1)
        sweepEnv.gain.linearRampToValueAtTime(0, noteTime + 0.5)
        const osc = audioCtx.createOscillator()
        osc.type = wave
        osc.frequency.value = freq

        osc.connect(sweepEnv).connect(audioCtx.destination);
        osc.start(noteTime)
        osc.stop(noteTime + beepLength / 4)
        console.log('playNote', freq, volume) 
    }

    const handlePlayPause = (evt) => {
        if(!audioCtx) {
            alert("No audio context")
        } else if (!playing) {
            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume()
            }
            setPlaying(true)
        } else {
            setPlaying(false)
        }
    } 

    const handleInit = (evt) => {
        setAudioCtx(sound.createAudioContext())
    } 

    const handleBack = (evt) => {
        setTime(0)
    } 

    return (
        <div id="player">
            {/*<button className="init" onClick={handleInit}><label className="icon"></label></button>*/}
            <button className={playing ? "pause":"play"} onClick={handlePlayPause}><label className="icon"></label></button>
            <button className="back" onClick={handleBack}><label className="icon"></label></button>
        </div>
    )
}

export default Player