import React, { createRef, useRef } from "react"
import siteConfig from '../../data/siteConfig'

const getFilename = () => 'beat_my_box'

const Generator = ({parts, setParts}) => {
    let svgRef = createRef()
    let svgLnkRef = createRef()
    let jsonLnkRef = createRef()

    const exportSvg = () => {
        var xml = svgRef.current.outerHTML;
        var type = 'image/svg+xml';
        var uri = 'data:' + type + ';utf8,' + encodeURIComponent(xml);
        var name = getFilename()+'.svg';
    
        var link = svgLnkRef.current;
        link.download = name;
        link.type = type;
        link.href = uri;
        link.click();
    };
    
    const exportJson = () => {
        var json = parts;
        var type = 'application/json';
        var uri = 'data:' + type + ';utf8,' + encodeURIComponent(JSON.stringify(json, null, ' '));
        var name = getFilename()+'.json';
    
        var link = jsonLnkRef.current;
        link.download = name;
        link.type = type;
        link.href = uri;
        link.click();
    };
        
    const importJson = (evt) => {
        var file = evt.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = (e) => {
          var impParts = JSON.parse(e.target.result);
          console.log('importJson', impParts);
          setParts(impParts);
        };
        reader.readAsText(file);
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

    return (
        <div id="generator">        
            <a className="exportSvgLnk" ref={svgLnkRef} href="/">Export SVG link</a>
            <button className="exportSvgBtn" onClick={exportSvg}>Export SVG</button>

            <a className="exportJsonLnk" ref={jsonLnkRef} href="/">Export JSON link</a>
            <button className="exportJsonBtn" onClick={exportJson}>Export JSON</button>

            <label className="button file">
                <input type="file" onChange={importJson} />
                Import JSON
            </label>
        </div>)
}

export default Generator