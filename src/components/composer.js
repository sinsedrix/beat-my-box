import React, { createRef, useRef } from "react"

const cutStyle = {
    stroke: '#FF0000',
    strokeWidth: '0.1mm',
    fill: 'none'
};

const engraveStyle = {
    stroke: 'none',
    strokeWidth: '0.1mm',
    fill: '#000000'
};

const Composer = ({ keys, parts, nbNotes, time, onCheckPart, onCheckTime }) => {
    let partRefs = useRef({})
    let timeRefs = useRef({})

    //console.log('parts,keys ', parts, keys)

    const handlePartClick = (e) => partRefs.current[e.target.id].click()
    const handleTimeClick = (e) => timeRefs.current[e.target.id].click()

    return (
        <div id="composer">
            <div className="parts">
            <table>
            <tbody>
            {keys.slice().reverse().map(octkeys => 
                octkeys.slice().reverse().map(key =>
                    <tr key={key.id} className='keyline'>
                        <th>{key.name}<sub>{key.oct}</sub></th>
                        {parts[key.id].map((hole, i) =>
                            <td key={key.id+i} className={i===time ? 'current' : ''}>
                                <input ref={el => partRefs.current[key.id+i] = el} id={key.id+','+i} type="checkbox" checked={hole} onChange={onCheckPart} />
                                <label id={key.id+i} className="icon" onClick={handlePartClick}></label>
                            </td>
                        )}
                    </tr>
                )
            )}
            <tr className='timeline'><th><label className='icon' /></th>
            {[...Array(nbNotes).keys()].map(i =>
                <td key={'t'+i} className={i===time ? 'current' : ''} >
                    <input ref={el => timeRefs.current['lt'+i] = el} id={'t'+i} type="radio" checked={i===time} onChange={onCheckTime} />
                    <label id={'lt'+i} onClick={handleTimeClick}></label>
                </td>
            )}
            </tr>
            </tbody>
            </table>
            </div>
        </div>
    )
}

export default Composer
