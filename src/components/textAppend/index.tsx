import React, { useCallback, useState } from 'react'
import './index.css'

import TextField  from "../textField";

const title = "Text Append";


function TextAppend() {
  // state 
  const [firstText, setFirstText] = useState<string>("");
  const [secondText, setSecondText] = useState<string>("");


  // onChangeHandler
  const handleChangeFirst = useCallback((text: string) => {
    setFirstText(String(text).trim());
  },[]);

  const handleChangeSecond = useCallback((text: string) => {
    setSecondText(String(text).trim());
  }, []);

  const concatenateString = useCallback(() => {
    if (!firstText && !secondText) {
      return "";
    } else if (!firstText || !secondText) {
      return `${firstText}${secondText}`;
    }
    return `${firstText}-${secondText}]`
  }, [firstText, secondText]);

 
  return (
      <section className="layout-column">
        <p>{title}</p>
        <div data-testid="first-text">
          <TextField labelText={'First Text'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeFirst(e.target.value)}/>
        </div >
        <div data-testid="second-text">
          <TextField labelText={'Second Text'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeSecond(e.target.value)}/>
        </div>
        <label className="mt-50 text-align-center">
          Appended Text is:
        </label>
        <label className="mt-10 finalText" data-testid="final-text">
          {concatenateString()}
        </label>
      </section>
  )
}

export default TextAppend
