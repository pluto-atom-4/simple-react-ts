import React from "react";
import "./index.css";

interface TextFieldProps {
  labelText: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextField ({ labelText, onChange }: TextFieldProps) {

  return (
    <div className="textfield">
        <label data-testid="label">{labelText}</label>
        <input data-testid="input" onChange={onChange}></input>
    </div>
  );
}

export default TextField;
