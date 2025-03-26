import React from 'react';
import '../components/styles/stadium.css'; // Import the CSS

const Stadium = () => {
  return (
    <div className="stadium-container">
      {/* <div className="sky"></div> */}
      {/* <div className="clouds"></div> */}
      {/* <div className="stands"></div> */}
      <div className="field">
        <div className='field-lines'>
          <div className="lines"></div>
          <div className="lines"></div>
          <div className="lines"></div>
          <div className="lines"></div>
          <div className="marks"></div>
          <div className="marks"></div>
          <div className="marks"></div>
          <div className="marks"></div>
        </div>
      </div>
    </div>
  );
};

export default Stadium;