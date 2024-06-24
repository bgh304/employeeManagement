import React from "react";
import { Outlet, Link } from "react-router-dom";

// TODO: kokeile <> sijasta <div>
export default function Layout() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/dashboard'>Employees</Link>
            <Link to='/departmentspage'>Departments</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}