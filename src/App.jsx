import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { EditBug } from './components/EditBug';
import { CreateBug } from './components/CreateBug';
import './index.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/edit/:id' element={<EditBug />} />
          <Route path='/create' element={<CreateBug />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

