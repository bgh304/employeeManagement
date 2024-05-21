import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import DepartmentsPage from "./components/DepartmentsPage";
import Authenticate from "./components/Authenticate";
import HeaderFooter from "./components/HeaderFooter";

function App() {
  // TODO: lisää auth={false} departmentspageen 
  return (
    <div className="App">
      <div>
        <HeaderFooter props='header' />
      </div>
      <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Authenticate />} />
            <Route path='/dashboard' element={<Dashboard auth={false} />} />
            <Route path='/departmentspage' element={<DepartmentsPage />} />
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