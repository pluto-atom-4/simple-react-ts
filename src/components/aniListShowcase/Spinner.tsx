import React from 'react';
import './index.css';

function Spinner() {
  return (
    <div className="anilist-loading">
      <div className="spinner"></div>
      <p>Loading anime listings...</p>
    </div>
  );
}

export default Spinner;

