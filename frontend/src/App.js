import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UAPForm from './components/UAPForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UAPForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
