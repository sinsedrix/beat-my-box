import React, { createRef, useRef } from "react"
import siteConfig from '../../data/siteConfig'

const drawStyleA = {
    stroke: '#0000FF',
    strokeWidth: '0.02mm',
    fill: 'none',
};

const drawStyleB = {
    stroke: '#0000FF',
    strokeWidth: '0.04mm',
    fill: 'none',
};

const fontStyle = {
    fill: '#0000FF',
    fontSize: '.5mm',
    stroke: 'none',
};

const engraveStyle = {
    fill: 'none',
    strokeWidth: '0.02mm',
    stroke: '#000000'
};

const noteSpacing = 2.08;

const Generator = ({parts, setParts, nbNotes}) => {
    let svgRef = createRef()
    let svgLnkRef = createRef()
    let jsonLnkRef = createRef()

    const exportSvg = () => {
        var xml = svgRef.current.outerHTML;
        var type = 'image/svg+xml';
        var uri = 'data:' + type + ';utf8,' + encodeURIComponent(xml);
        var name = 'beat_my_box.svg';
    
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
        var name = 'beat_my_box.json';
    
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

            <div id="svgview">
            <svg ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="480mm" height="41mm"
                viewBox="0 0 480 41">
                <rect style={engraveStyle} x={0} y={0} width={50+4*nbNotes} height={41} />
                <polygon points="15,20 25,15 25,25" style={fontStyle} />
                {Object.keys(parts).slice().reverse().map((key, i) =>
                    <g key={'k'+key}>
                        <text style={fontStyle} x={34} y={6.5+noteSpacing*i}>{key}</text>
                        <line style={drawStyleA} x1={38} y1={6+noteSpacing*i} x2={38+4*nbNotes} y2={6+noteSpacing*i} />
                        {[...Array(nbNotes).keys()].map(j => 
                            <>
                            <line style={j%4 ? drawStyleA : drawStyleB} x1={38+4*j} y1={5+noteSpacing*i} x2={38+4*j} y2={7+noteSpacing*i} />
                            </>
                        )}
                    </g>
                )}
                {Object.keys(parts).slice().reverse().map((key, i) =>
                    <g key={'h'+key}>
                        {parts[key].map((hole, j) => 
                            <>
                            { hole && <circle style={engraveStyle} cx={40+4*j} cy={6+noteSpacing*i} r={1} />}
                            </>
                        )}
                    </g>
                )}
                <text x={34} y={4} fontFamily="Verdana" fontSize="10" style={fontStyle}>{siteConfig.title + ' by ' + siteConfig.author}</text>

            </svg>
            </div>
        </div>
        )
}

export default Generator