import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Payment from './components/payment/StripePayment'
import Register from './pages/Register';
import Verify from './pages/Verify';
import Login from './pages/Login';

import { AuthProvider } from './context/AuthContext';


function App() {

  return (
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
