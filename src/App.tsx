import React, { Suspense } from 'react';
import './App.css';
import TextAppend from "./components/textAppend";
import SearchFilter from "./components/searchFilter";
import AniListShowcase from "./components/aniListShowcase";
import AniListErrorBoundary from './components/aniListShowcase/AniListErrorBoundary';
import Spinner from './components/aniListShowcase/Spinner';
import Todo from "./components/todo";
import CounterHistory from "./components/counterHistory";
import MemoizedList from "./components/memoizedList";
import PrefixSearchInput from "./components/prefixSearchInput";

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
          <AniListErrorBoundary>
            <Suspense fallback={<Spinner />}>
              <AniListShowcase />
            </Suspense>
          </AniListErrorBoundary>
        </div>
        <div className="components-grid">
          <Todo />
          <CounterHistory />
        </div>
        <div className="components-grid">
          <MemoizedList />
          <PrefixSearchInput />
        </div>
      </div>
    </div>
  )
}

export default App
