import React, { createRef, useRef } from "react"
import siteConfig from '../../data/siteConfig'

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

const Generator = () => {
    let svgRef = createRef()
    let lnkRef = createRef()

    return (
        <div>        
            <a className="downloadLnk" ref={lnkRef} href="/">Download link</a>
            <button className="downloadBtn" onClick={downloadSvg}>Download</button>
        </div>)
}

export default Generator