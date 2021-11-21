import React from "react"

const renderSetting = (param, values, onChange) => {
    switch(param.type) {
        case 'select':
            return (<div key={param.id}>
                <label htmlFor={param.id}>{param.name} :</label>
                <select type={param.type} 
                        name={param.name} id={param.id}
                        value={values[param.id]}
                        onChange={onChange}>
                            {param.values.map(val =>
                                <option key={val.value} value={val.value}>{val.text}</option>
                            )}
                </select>
            </div>)
        case 'number':
            return (<div key={param.id}>
                <label htmlFor={param.id}>{param.name} :
                <input type={param.type} min={param.min} max={param.max} step={param.step}
                        name={param.id} id={param.id}
                        value={values[param.id]} onChange={onChange} />
                </label>
            </div>)
    }
}

const Settings = ({ params, values, onChange }) => (
    <fieldset className="settings">
        <legend>Settings:</legend>
        {params.map(param => renderSetting(param, values, onChange))}
    </fieldset>
)

export default Settings