import React, { createRef, useRef } from "react"
import siteConfig from '../../data/siteConfig'

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

const Composer = ({ keys, parts, onCheck }) => {
    let svgRef = createRef()
    let lnkRef = createRef()
    let inputRefs = useRef({})

    const getFilename = ({ w, h, d, bt }) => 'beatbox_' + w + 'x' + h + 'x' + d + '_' + bt + '.svg'
    

    const downloadSvg = () => {
        var xml = svgRef.current.outerHTML;
        var type = 'image/svg+xml';
        var uri = 'data:' + type + ';utf8,' + encodeURIComponent(xml);
        var name = getFilename(values);

        var link = lnkRef.current;
        link.download = name;
        link.type = type;
        link.href = uri;
        link.click();
    };

    const svgRender = () =>
        <div id="svgview">
            <svg ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="600" height="300"
                viewBox="0 0 600 300">
                {keys.map(key => 
                    <g/>
                )}
                {parts.map(part =>
                    <g/>
                )}
                <text x={10} y={280} fontFamily="Verdana" fontSize="10" style={engraveStyle}>{siteConfig.title + ' by ' + siteConfig.author}</text>
                <text x={10} y={290} fontFamily="Verdana" fontSize="10" style={engraveStyle}>{getFilename(values)}</text>
            </svg>
        </div>

    console.log('parts,keys ', parts, keys)

    const handleClick = (e) => inputRefs.current[e.target.id].click()
    
    return (
        <div id="htmlview">
            <div className="parts">
            <table>
            <tbody>
            {keys.slice().reverse().map(octkeys => 
                octkeys.slice().reverse().map(key =>
                    <tr key={key.id}>
                        <th>{key.name}<sub>{key.oct}</sub></th>
                        {parts[key.id].map((hole, i) =>
                            <td key={key.id+i}>
                                <input ref={el => inputRefs.current[key.id+i] = el} id={key.id+','+i} type="checkbox" checked={hole} onChange={onCheck} />
                                <label id={key.id+i} onClick={handleClick}></label>
                            </td>
                        )}
                    </tr>
                )
            )}
            </tbody>
            </table>
            </div>

            <a className="downloadLnk" ref={lnkRef} href="/">Download link</a>
            <button className="downloadBtn" onClick={downloadSvg}>Download</button>
        </div>
    )
}

export default Composer
