import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Dashboard from "./components/Dashboard";
import Authenticate from "./components/Authenticate";
import HeaderFooter from "./components/HeaderFooter";

function App() {

  return (
    <div className="App">
      <div>
        <HeaderFooter props='header' />
      </div>
      <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Authenticate />} />
          <Route path='/dashboard' element={<Dashboard auth={false} />} />
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