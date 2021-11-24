import React, { createRef, useRef, useState } from "react"
import * as sound from "../sound"

const Player = ({ keys, parts, time, setTime, nbNotes, tempo, wave, customWaveform, attackTime, releaseTime }) => {
    const [audioCtx, setAudioCtx] = useState(sound.createAudioContext())
    const [playing, setPlaying] = useState(false)
    const [timerId, setTimerId] = useState(null)
    const [noteTime, setNoteTime] = useState(0.0)
    const lookahead = 25.0 // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)
    const beepLength = 1;

    const runScheduler = () => {
        // while there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (noteTime < audioCtx.currentTime + scheduleAheadTime ) {
            scheduleNote()
            nextNote()
        }
        setTimerId(window.setTimeout(runScheduler, lookahead))
    }

    const nextNote = () => {
        const secondsPerBeat = 60.0 / tempo    
        setNoteTime(noteTime + secondsPerBeat / 8) // Add beat length to last beat time      
        // Advance the beat number, wrap to zero
        setTime((time+1)%nbNotes)
    }

    const scheduleNote = () => {      
        for(let kid in parts) {
            let part = parts[kid]
            if(part[time]) {
                let key = keys.reduce((a, octkeys) => a || octkeys.find(octk => octk.id === kid), null)
                console.log('scheduleNote', key)
                playBeep(time, key.freq)
            }
        }
    }
    
    const playBeep = (freq) => {
        const osc = audioCtx.createOscillator()
      
        if (wave == "custom") {
          osc.setPeriodicWave(customWaveform)
        } else {
          osc.type = wave
        }
      
        osc.frequency.value = freq
      
        const beepEnv = audioCtx.createGain()
        beepEnv.gain.cancelScheduledValues(noteTime)
        beepEnv.gain.setValueAtTime(0, noteTime)
        beepEnv.gain.linearRampToValueAtTime(1, noteTime + attackTime)
        beepEnv.gain.linearRampToValueAtTime(0, noteTime + beepLength - releaseTime)
      
        osc.connect(beepEnv).connect(audioCtx.destination)
        osc.start(noteTime)
        osc.stop(noteTime + beepLength)
    }

    const handlePlayPause = (evt) => {
        if (!playing) {
            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            setTime(0);
            setNoteTime(audioCtx.currentTime)
            runScheduler() // kick off scheduling
        } else {
            window.clearTimeout(timerId);
        }
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