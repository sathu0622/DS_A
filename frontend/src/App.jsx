import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home';
import Payment from './components/payment/StripePayment'
import Register from './pages/Register';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Checkout from './components/orderprocess/Checkout';


import Temp from './pages/temp'
import NewTemp from "./pages/NewTemp";

import Tracking from './components/orderprocess/Tracking';

import { AuthProvider } from './context/AuthContext';
import AddMenuItemForm from './pages/AddMenuItemForm';
import AddRestaurantForm from './pages/AddRestaurantForm';
import ViewMenuItems from './pages/ViewMenuItems';
import MyRestaurants from './pages/MyRestaurants';

import RestaurantRegister from './pages/RestaurantRegister'
import DriverRegister from './pages/DriverRegister'
import UpdateLocation from './pages/UpdateLocation'
function App() {

  return (
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-restaurant" element={<RestaurantRegister />} />
          <Route path="/register-driver" element={<DriverRegister />} />

          <Route path="/update-location" element={<UpdateLocation />} />

          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/tracking" element={<Tracking />} />
          <Route path="/temp" element={<Temp />} />
          <Route path="/restaurants/:restaurantId" element={<NewTemp />} />
        <Route path="/addMenu" element={<AddMenuItemForm />} />
        <Route path="/addRestaurant" element={<AddRestaurantForm />} />
        <Route path="/viewMenuItems" element={<ViewMenuItems />} />
        <Route path="/myRestaurants" element={<MyRestaurants />} />
        
        </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
