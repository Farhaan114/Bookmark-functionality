// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Items from './components/Items';
import Register from './components/Register';
import Bookmarks from './components/Bookmarks';

// Private route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items" element={<PrivateRoute> <Items /> </PrivateRoute>} />
        <Route path="/bookmarks" element={<PrivateRoute> <Bookmarks /> </PrivateRoute>} />      
      </Routes>
    </Router>
  );
};

export default App;
