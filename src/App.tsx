import React from 'react'
import './App.css'
import TextAppend from "./components/textAppend";
import SearchFilter from "./components/searchFilter";
import AniListShowcase from "./components/aniListShowcase";

function App() {
  return (
    <div className="app">
      <div className="header">
        <div>
          <img src="https://storage.googleapis.com/coderpad_project_template_assets/coderpad_logo.svg" />
        </div>
        <div>
          <img src="https://storage.googleapis.com/coderpad_project_template_assets/react.svg" />
          <span>React App</span>
        </div>
      </div>
      <div className="content">
        {/*<img src="https://storage.googleapis.com/coderpad_project_template_assets/react.svg" />*/}
        {/*<p>Hello React!</p>*/}
        <div className="components-grid">
          <TextAppend />
          <SearchFilter />
          <AniListShowcase />
        </div>
      </div>
    </div>
  )
}

export default App
