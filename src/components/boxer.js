import React, { useCallback, useEffect, useState } from "react"
import Composer from "./composer"
import Settings from "./settings"
import Generator from "./generator"
import Keyboard from "./keyboard"
import Player from "./player"

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const freq = (o, n) => 55*Math.pow(2, o+(n+3)/12)


const Boxer = ({ ranges, settings }) => {
  const initVals = { t: "kikker-15", n: 64, bpm: 120, w:"triangle", v: 0.3 }
  const [values, setValues] = useState(initVals)
  const [keys, setKeys] = useState([])
  const [parts, setParts] = useState({})
  const [noteIndex, setNoteIndex] = useState(0)

  const computeParts = useCallback(() => {
    let newKeys = ranges.find(rg => rg.id === values.t).range.map(rg =>
      rg.notes.map(note => ({
        id: note+rg.oct,
        name: note,
        oct: rg.oct,
        freq: freq(rg.oct, noteNames.indexOf(note))
      })), []
    )
    console.log('newKeys', newKeys)
    setKeys(newKeys)

    let newParts = newKeys.reduce((o, octk) => ({ ...o, ...octk.reduce((a, key) => ({ ...a, [key.id]: Array(values.n).fill(false) }), {}) }), {})
    Object.keys(newParts).forEach(k => newParts[k].forEach((v,i) => newParts[k][i] = i < (parts[k] ? parts[k].length : 0) ? parts[k][i] : false))
    //console.log('newParts', newParts)
    setParts(newParts)
  }, [values])

  useEffect(computeParts, [values])

  const handleSettingChange = (event) => {
    console.log('handleSettingChange', event.target)
    setValues({ ...values, [event.target.id]: Number(event.target.value) })
  }

  const handleCheckPart = (event) => {
    let [noteid,t] = event.target.id.split(',')
    console.log('handleCheckPart', noteid, t)
    let newPart = parts[noteid].slice()
    newPart[t] = !newPart[t]
    setParts({ ...parts, [noteid]: newPart })
  }

  const handleCheckTime = (event) => {
    let t = Number(event.target.id.slice(1))
    console.log('handleCheckTime', t)
    setNoteIndex(t)
  }

  return (
    <div>
      <Settings params={settings} values={values} onChange={handleSettingChange} />
      <Keyboard keys={keys} volume={values.v} wave={values.w} />
      <Composer keys={keys} parts={parts} noteIndex={noteIndex} nbNotes={values.n} onCheckPart={handleCheckPart} onCheckTime={handleCheckTime} />
      <Player keys={keys} parts={parts} setNoteIndex={setNoteIndex} volume={values.v} nbNotes={values.n} tempo={values.bpm} wave={values.w} />
      <Generator parts={parts} setParts={setParts} nbNotes={values.n} />
    </div>
  )

}

export default Boxer