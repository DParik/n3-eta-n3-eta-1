import React, { ChangeEventHandler } from 'react';

import './radioButton.scss';

export type RadioButtonProps = {
    id: string;
    name: string;
    value: string;
    label: string;
    onChange: ChangeEventHandler;
}

const RadioButton = ({id, name, value, label, onChange} : RadioButtonProps) : JSX.Element => {
    return (
        <div className="radioButtonWrapper">
            <input id={id} name={name} type="radio" value={value} onChange={(event: any) => onChange(event.target.value)}/>
            <label>{label}</label>
        </div>
    );
}

export default RadioButton;