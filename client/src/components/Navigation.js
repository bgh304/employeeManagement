import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <div className='navigation'>
      <nav>
        <Link to='/employeespage'>
          <div className='navigationbutton' style={{ height: '15%', marginRight: '40px' }}>
            <p>EMPLOYEES</p>
          </div>
        </Link>
        <Link to='/departmentspage'>
          <div className='navigationbutton' style={{ height: '15%', marginRight: '10px' }}>
            <p>DEPARTMENTS</p>
          </div>
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}