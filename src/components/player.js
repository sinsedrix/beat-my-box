import React, { useEffect, useState, useCallback } from "react"
import * as sound from "../sound"

const Player = ({ keys, parts, setNoteIndex, volume, nbNotes, tempo, wave }) => {
    const [playing, setPlaying] = useState(false)
    let isPlaying = false
    const audioCtx = sound.createAudioContext()
    const beepLength = 1
    const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    let timerId = 0
    let currentNote = 0; // The note we are currently playing
    let nextNoteTime = 0.0; // when the next note is due.

    const nextNote = () => {
        const secondsPerBeat = 60.0 / tempo / 2;
        
        nextNoteTime += secondsPerBeat; // Add beat length to last beat time
        currentNote = (currentNote+1)%nbNotes; // Advance the beat number, wrap to zero
        //setNoteIndex(currentNote)
    }

    const play = () => {
        //console.log('play', isPlaying, nextNoteTime, audioCtx.currentTime + scheduleAheadTime)  
        if(isPlaying) {
            while(isPlaying && nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
                playNotes()
                nextNote()
            }
            timerId = setTimeout(play, lookahead)
        }
    }

    const playNotes = () => {    
        const noteTime = nextNoteTime  
        for(let kid in parts) {
            let part = parts[kid]
            if(part[currentNote]) {
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

    const handlePlay = (evt) => {
        if (!isPlaying) {
            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume()
            }
            nextNoteTime = audioCtx.currentTime
            isPlaying = true
            play()
            //setPlaying(true)
        }
    } 

    const handlePause = (evt) => {
        if(isPlaying) {
            clearTimeout(timerId)
            isPlaying = false
            //setPlaying(false)
        }
    } 

    const handleBack = (evt) => {
        currentNote = 0
        nextNoteTime = audioCtx.currentTime
        //setNoteIndex(currentNote)
    } 

    return (
        <div id="player">
            <button className={"play"} onClick={handlePlay}><label className="icon"></label></button>
            <button className={"pause"} onClick={handlePause}><label className="icon"></label></button>
            <button className="back" onClick={handleBack}><label className="icon"></label></button>
        </div>
    )
}

export default Player