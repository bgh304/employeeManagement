import React from 'react';
import './../App.css';

export default function HeaderFooter(props) {
  if (props.props === 'header') {
    return (
      <div className="header"
        style={{
          left: 0,
          top: 0,
          right: 0,
        }}
      >
        <p>SIMPLE EMPLOYEE MANAGEMENT SYSTEM</p>
      </div>
    )
  }

  if (props.props === 'footer') {
    return (
      <div className="footer"
        style={{
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <p />
      </div>
    )
  }
}