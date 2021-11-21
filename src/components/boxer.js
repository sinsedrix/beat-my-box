import React, { useCallback, useEffect, useState } from "react"
import Composer from "./composer"
import Settings from "./settings";

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const freq = (o, n) => 55*Math.pow(2, o+(n+3)/12)


const Boxer = ({ ranges, settings }) => {
  const initVals = { r: "kikker-15", n: 64 }
  const [values, setValues] = useState(initVals)
  const [keys, setKeys] = useState([])
  const [parts, setParts] = useState({})
  const [time, setTime] = useState('t0' )

  const computeParts = useCallback(() => {
    let newKeys = ranges.find(rg => rg.id === values.r).range.map(rg =>
      rg.notes.map(note => ({
        id: note+rg.oct,
        name: note,
        oct: rg.oct,
        freq: freq(rg.oct, noteNames.indexOf(note))
      })), []
    )
    //console.log('newKeys', newKeys)
    setKeys(newKeys)

    let newParts = newKeys.reduce((o, octk) => ({ ...o, ...octk.reduce((a, key) => ({ ...a, [key.id]: Array(values.n).fill(false) }), {}) }), {})
    //console.log('newParts', newParts)
    setParts(newParts)
  }, [values])

  useEffect(computeParts, [values])

  const handleSettingChange = (event) => {
    console.log('handleSettingChange', event.target)
    setValues({ ...values, [event.target.id]: event.target.value })
  }

  const handleCheckPart = (event) => {
    let [noteid,t] = event.target.id.split(',')
    console.log('handleCheckPart', noteid, t)
    let newPart = parts[noteid].slice()
    newPart[t] = !newPart[t]
    setParts({ ...parts, [noteid]: newPart })
  }

  const handleCheckTime = (event) => {
    let t = event.target.id
    console.log('handleCheckTime', t)
    setTime(t)
  }

  return (
    <div>
      <Composer keys={keys} parts={parts} time={time} nbNotes={values.n} onCheckPart={handleCheckPart} onCheckTime={handleCheckTime} />
      <Settings params={settings} values={values} onChange={handleSettingChange} />
    </div>
  )

}

export default Boxer