import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Navigation from "./components/Navigation";
import EmployeesPage from "./components/EmployeesPage";
import DepartmentsPage from "./components/DepartmentsPage";
import Authenticate from "./components/Authenticate";
import Settings from "./components/Settings";
import HeaderFooter from "./components/HeaderFooter";

function App() {
  return (
    <div className="App" style={{ marginRight: '-7px' }}>
      <div>
        <HeaderFooter props='header' />
      </div>
      <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Authenticate />} />
          <Route path='/' element={<Navigation />}>
            <Route path='/employeespage' element={<EmployeesPage auth={false} />} />
            <Route path='/departmentspage' element={<DepartmentsPage auth={false} />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Routes> 
      </BrowserRouter>
      </div>
      <div>
        <HeaderFooter props='footer' />
      </div>
    </div>
  );
}

export default App;