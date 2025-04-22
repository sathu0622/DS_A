import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// import Home from './components/Home/Home'
import Payment from './components/payment/StripePayment'
// import About from './pages/About'

function App() {

  return (
    <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/payment" element={<Payment />} />
        </Routes>
    </Router>
  )
}

export default App
