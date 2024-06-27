import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/employeespage'>Employees</Link>
            <Link to='/departmentspage'>Departments</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}