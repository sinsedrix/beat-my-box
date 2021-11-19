import React from "react"

const Settings = ({ params, values, onChange }) => (
    <fieldset className="settings">
        <legend>Settings:</legend>
        {params.map(param =>
            <div key={param.id}>
                <label htmlFor={param.id}>{param.name} :</label>
                <select type={param.type} 
                        name={param.name} id={param.id}
                        value={values[param.id]}
                        onChange={onChange}>
                            {param.values.map(val =>
                                <option key={val.value} value={val.value}>{val.text}</option>
                            )}
                </select>
            </div>
        )}
    </fieldset>
)

export default Settings