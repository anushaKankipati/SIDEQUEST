import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
;
type Props = {
  name:string
  label: string;
  value: string;
  icon: IconDefinition;
  isSelected: boolean;
  onClick: (value: string) => void;
};

export default function LabelRadioButton({ 
    name, label, value, icon, isSelected, onClick 
}: Props) {
  return (
    <label className={`radio-btn group ${isSelected ? 'bg-light-hover-green' : ''}`}>
      <input 
        onClick={() => onClick(value)} 
        className="hidden" 
        type="radio" 
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => {}}
      />
      <span className="icon group-has-[:checked]:bg-theme-green group-has-[:checked]:text-white">
        <FontAwesomeIcon icon={icon}/>
      </span>
      {label}
    </label>
  );
}