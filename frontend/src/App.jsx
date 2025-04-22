import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Payment from './components/payment/StripePayment'
import Signup from "./pages/Signup";
import Login from "./pages/Login";


function App() {

  return (
    <Router>
        <Routes>
          <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  )
}

export default App
