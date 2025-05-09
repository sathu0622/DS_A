import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home';
import Payment from './components/payment/StripePayment'
import Register from './pages/Register';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Checkout from './components/orderprocess/Checkout';


import Loghome from './pages/loginHome'
import Menuitem from "./pages/Menuitem";

import Tracking from './components/orderprocess/Tracking';

import { AuthProvider } from './context/AuthContext';
import AddMenuItemForm from './pages/AddMenuItemForm';
import AddRestaurantForm from './pages/AddRestaurantForm';
import ViewMenuItems from './pages/ViewMenuItems';
import MyRestaurants from './pages/MyRestaurants';

import RestaurantRegister from './pages/RestaurantRegister'
import DriverRegister from './pages/DriverRegister'
import UpdateLocation from './pages/UpdateLocation'
import RestaurantDashboard from './pages/RestaurantDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ConfirmOrder from './pages/ConfirmOrder';

import Navbar from './components/main_components/NavBar'

import UserProfile from './pages/UserProfile'
function App() {

  return (
    <AuthProvider>

    <Router>
    <Navbar/>
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
          <Route path="/loghome" element={<Loghome />} />
          <Route path="/restaurants/:restaurantId" element={<Menuitem />} />
        <Route path="/addMenu" element={<AddMenuItemForm />} />
        <Route path="/addRestaurant" element={<AddRestaurantForm />} />
        <Route path="/viewMenuItems" element={<ViewMenuItems />} />
        <Route path="/myRestaurants" element={<MyRestaurants />} />
        <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} /> ConfirmOrder
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/confirmOrder" element={<ConfirmOrder />} />
        </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
